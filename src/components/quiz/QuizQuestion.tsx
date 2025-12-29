import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Question, QuizOption } from "@/types/quiz";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  showResult = false,
  isCorrect,
}: QuizQuestionProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>{question.points} point{question.points !== 1 ? "s" : ""}</span>
        </div>
        <CardTitle className="text-xl leading-relaxed">
          {question.question_text}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.options.map((option: QuizOption) => {
          const isSelected = selectedOption === option.id;
          const isCorrectOption = option.id === question.correct_option_id;

          let optionStyles = "border-2 transition-all cursor-pointer hover:border-primary/50";
          
          if (showResult) {
            if (isCorrectOption) {
              optionStyles = "border-2 border-green-500 bg-green-50 dark:bg-green-900/20";
            } else if (isSelected && !isCorrectOption) {
              optionStyles = "border-2 border-red-500 bg-red-50 dark:bg-red-900/20";
            } else {
              optionStyles = "border-2 border-muted opacity-50";
            }
          } else if (isSelected) {
            optionStyles = "border-2 border-primary bg-primary/5";
          }

          return (
            <Button
              key={option.id}
              variant="outline"
              className={cn(
                "w-full justify-start text-left h-auto py-4 px-4",
                optionStyles
              )}
              onClick={() => !showResult && onSelectOption(option.id)}
              disabled={showResult}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="font-semibold text-muted-foreground uppercase">
                  {option.id}.
                </span>
                <span className="flex-1">{option.text}</span>
                {showResult && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </Button>
          );
        })}

        {showResult && question.explanation && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold">Explanation: </span>
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
