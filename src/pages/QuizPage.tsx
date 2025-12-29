import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuizWithQuestions, useStartQuizAttempt, useSubmitAnswer, useCompleteQuizAttempt } from "@/hooks/useQuizzes";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import { QuizSummaryCard } from "@/components/quiz/QuizSummary";
import { QuizTimer } from "@/components/quiz/QuizTimer";
import { QuizAnswer, QuizSummary } from "@/types/quiz";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { toast } from "sonner";

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const { data: quiz, isLoading: quizLoading, error: quizError } = useQuizWithQuestions(quizId);
  const startAttempt = useStartQuizAttempt();
  const submitAnswer = useSubmitAnswer();
  const completeAttempt = useCompleteQuizAttempt();

  const [attempt, setAttempt] = useState<{ id: string; started_at: string } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to take quizzes");
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Start quiz attempt
  useEffect(() => {
    if (quiz && quiz.questions && quiz.questions.length > 0 && !attempt && isAuthenticated) {
      startAttempt.mutate(
        { quizId: quiz.id, totalQuestions: quiz.questions.length },
        {
          onSuccess: (data) => {
            setAttempt({ id: data.id, started_at: data.started_at });
          },
          onError: (error) => {
            toast.error("Failed to start quiz");
            console.error(error);
          },
        }
      );
    }
  }, [quiz, attempt, isAuthenticated]);

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const totalQuestions = quiz?.questions?.length || 0;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = useCallback(async (skip: boolean = false) => {
    if (!attempt || !currentQuestion) return;

    const optionToSubmit = skip ? null : selectedOption;

    try {
      const answer = await submitAnswer.mutateAsync({
        attemptId: attempt.id,
        questionId: currentQuestion.id,
        selectedOptionId: optionToSubmit,
        correctOptionId: currentQuestion.correct_option_id,
      });

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: answer,
      }));

      if (!skip) {
        setShowResult(true);
      } else {
        // If skipping, move to next question immediately
        moveToNextQuestion();
      }
    } catch (error) {
      toast.error("Failed to submit answer");
      console.error(error);
    }
  }, [attempt, currentQuestion, selectedOption, submitAnswer]);

  const moveToNextQuestion = () => {
    setShowResult(false);
    setSelectedOption(null);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Quiz finished
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = async () => {
    if (!attempt || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const allAnswers = Object.values(answers);
      
      // Add any unanswered questions as skipped
      const answeredQuestionIds = new Set(allAnswers.map(a => a.question_id));
      const skippedAnswers: QuizAnswer[] = (quiz?.questions || [])
        .filter(q => !answeredQuestionIds.has(q.id))
        .map(q => ({
          id: '',
          attempt_id: attempt.id,
          question_id: q.id,
          selected_option_id: null,
          is_correct: null,
          is_skipped: true,
          answered_at: new Date().toISOString(),
        }));

      const result = await completeAttempt.mutateAsync({
        attemptId: attempt.id,
        answers: [...allAnswers, ...skippedAnswers],
        startedAt: attempt.started_at,
        passingScore: quiz?.passing_score || 60,
      });

      setSummary(result.summary);
      setQuizCompleted(true);
    } catch (error) {
      toast.error("Failed to complete quiz");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = useCallback(() => {
    toast.warning("Time's up!");
    handleCompleteQuiz();
  }, []);

  // Loading states
  if (authLoading || quizLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (quizError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">Failed to load quiz</p>
        <Button onClick={() => navigate("/quizzes")}>Back to Quizzes</Button>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No questions found for this quiz</p>
        <Button onClick={() => navigate("/quizzes")}>Back to Quizzes</Button>
      </div>
    );
  }

  // Quiz completed - show summary
  if (quizCompleted && summary) {
    return (
      <div className="min-h-screen p-8">
        <QuizSummaryCard summary={summary} quizTitle={quiz.title} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <p className="text-muted-foreground">{quiz.skills?.name}</p>
          </div>
          {attempt && (
            <QuizTimer
              durationMinutes={quiz.duration_minutes}
              startedAt={new Date(attempt.started_at)}
              onTimeUp={handleTimeUp}
            />
          )}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{currentQuestionIndex + 1} / {totalQuestions}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        {currentQuestion && (
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            selectedOption={selectedOption}
            onSelectOption={handleSelectOption}
            showResult={showResult}
            isCorrect={answers[currentQuestion.id]?.is_correct ?? undefined}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0 || showResult}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {!showResult && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => handleSubmitAnswer(true)}
                  disabled={submitAnswer.isPending}
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </Button>
                <Button
                  onClick={() => handleSubmitAnswer(false)}
                  disabled={!selectedOption || submitAnswer.isPending}
                >
                  {submitAnswer.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Submit Answer
                </Button>
              </>
            )}

            {showResult && (
              <Button onClick={moveToNextQuestion}>
                {currentQuestionIndex === totalQuestions - 1 ? (
                  "Finish Quiz"
                ) : (
                  <>
                    Next Question
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
