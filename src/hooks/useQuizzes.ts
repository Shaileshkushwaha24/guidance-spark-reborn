import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quiz, Question, QuizAttempt, QuizAnswer, QuizDifficulty, QuizSummary, QuizOption } from "@/types/quiz";

// Fetch all skills with their quizzes
export const useSkillsWithQuizzes = () => {
  return useQuery({
    queryKey: ["skills-with-quizzes"],
    queryFn: async () => {
      const { data: skills, error: skillsError } = await supabase
        .from("skills")
        .select("*")
        .order("name");

      if (skillsError) throw skillsError;

      const { data: quizzes, error: quizzesError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("is_active", true)
        .order("difficulty");

      if (quizzesError) throw quizzesError;

      // Group quizzes by skill
      const skillsWithQuizzes = skills.map((skill) => ({
        ...skill,
        quizzes: quizzes.filter((q) => q.skill_id === skill.id),
      }));

      return skillsWithQuizzes;
    },
  });
};

// Fetch all active quizzes with their skills
export const useQuizzes = () => {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select(`
          *,
          skills (*)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (Quiz & { skills: { name: string; category: string } })[];
    },
  });
};

// Fetch a single quiz with its questions
export const useQuizWithQuestions = (quizId: string | undefined) => {
  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      if (!quizId) throw new Error("Quiz ID is required");

      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select(`
          *,
          skills (*)
        `)
        .eq("id", quizId)
        .single();

      if (quizError) throw quizError;

      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("order_index");

      if (questionsError) throw questionsError;

      // Parse options from JSONB
      const parsedQuestions: Question[] = questions.map((q) => ({
        ...q,
        options: q.options as unknown as QuizOption[],
      }));

      return { ...quiz, questions: parsedQuestions } as Quiz & { skills: { name: string } };
    },
    enabled: !!quizId,
  });
};

// Start a quiz attempt
export const useStartQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quizId, totalQuestions }: { quizId: string; totalQuestions: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("quiz_attempts")
        .insert({
          user_id: user.id,
          quiz_id: quizId,
          total_questions: totalQuestions,
          status: "in_progress",
        })
        .select()
        .single();

      if (error) throw error;
      return data as QuizAttempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-attempts"] });
    },
  });
};

// Submit an answer
export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: async ({
      attemptId,
      questionId,
      selectedOptionId,
      correctOptionId,
    }: {
      attemptId: string;
      questionId: string;
      selectedOptionId: string | null;
      correctOptionId: string;
    }) => {
      const isSkipped = selectedOptionId === null;
      const isCorrect = !isSkipped && selectedOptionId === correctOptionId;

      const { data, error } = await supabase
        .from("quiz_answers")
        .upsert({
          attempt_id: attemptId,
          question_id: questionId,
          selected_option_id: selectedOptionId,
          is_correct: isSkipped ? null : isCorrect,
          is_skipped: isSkipped,
        }, {
          onConflict: "attempt_id,question_id"
        })
        .select()
        .single();

      if (error) throw error;
      return data as QuizAnswer;
    },
  });
};

// Complete a quiz attempt
export const useCompleteQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attemptId,
      answers,
      startedAt,
      passingScore = 60,
    }: {
      attemptId: string;
      answers: QuizAnswer[];
      startedAt: string;
      passingScore?: number;
    }) => {
      const total = answers.length;
      const correct = answers.filter((a) => a.is_correct === true).length;
      const wrong = answers.filter((a) => a.is_correct === false).length;
      const skipped = answers.filter((a) => a.is_skipped).length;
      const scorePercentage = total > 0 ? (correct / total) * 100 : 0;

      // Calculate time taken
      const startTime = new Date(startedAt).getTime();
      const endTime = Date.now();
      const timeTakenSeconds = Math.floor((endTime - startTime) / 1000);

      // Determine recommended level based on score
      let recommendedLevel: QuizDifficulty;
      if (scorePercentage >= 80) {
        recommendedLevel = "advanced";
      } else if (scorePercentage >= 50) {
        recommendedLevel = "intermediate";
      } else {
        recommendedLevel = "beginner";
      }

      const { data, error } = await supabase
        .from("quiz_attempts")
        .update({
          ended_at: new Date().toISOString(),
          status: "completed",
          correct_answers: correct,
          wrong_answers: wrong,
          skipped_questions: skipped,
          score_percentage: scorePercentage,
          time_taken_seconds: timeTakenSeconds,
          recommended_level: recommendedLevel,
        })
        .eq("id", attemptId)
        .select()
        .single();

      if (error) throw error;

      const summary: QuizSummary = {
        total,
        correct,
        wrong,
        skipped,
        accuracy: `${Math.round(scorePercentage)}%`,
        timeTaken: formatTime(timeTakenSeconds),
        recommendedLevel,
        passed: scorePercentage >= passingScore,
      };

      return { attempt: data as QuizAttempt, summary };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-attempts"] });
    },
  });
};

// Fetch user's quiz attempts
export const useUserQuizAttempts = () => {
  return useQuery({
    queryKey: ["quiz-attempts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("quiz_attempts")
        .select(`
          *,
          quizzes (
            title,
            difficulty,
            skills (name)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Helper function to format time
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}
