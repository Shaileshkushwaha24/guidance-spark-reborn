import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const previewQuestions = [
  {
    question: "What describes you best?",
    options: ["Analytical thinker", "Creative problem solver", "People person", "Detail-oriented"],
  },
  {
    question: "Your ideal work environment?",
    options: ["Office / Remote", "Outdoors / Field", "Lab / Research", "Studio / Creative space"],
  },
  {
    question: "What motivates you most?",
    options: ["Financial growth", "Making an impact", "Learning new things", "Work-life balance"],
  },
];

export const QuickQuizPreview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    const newSelections = [...selectedOptions];
    newSelections[currentQuestion] = optionIndex;
    setSelectedOptions(newSelections);

    if (currentQuestion < previewQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setIsComplete(true);
      }, 300);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOptions([]);
    setIsComplete(false);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-accent/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Quick Career Quiz</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Your Ideal Career Path
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Answer 3 quick questions to get personalized career recommendations
          </p>
        </div>

        <Card className="max-w-xl mx-auto p-8 bg-card border-2 shadow-soft-lg">
          {!isComplete ? (
            <>
              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-8">
                {previewQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      index <= currentQuestion
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Question */}
              <div className="mb-8 animate-fade-in" key={currentQuestion}>
                <span className="text-sm text-muted-foreground mb-2 block">
                  Question {currentQuestion + 1} of {previewQuestions.length}
                </span>
                <h3 className="text-xl font-semibold">
                  {previewQuestions[currentQuestion].question}
                </h3>
              </div>

              {/* Options */}
              <div className="grid gap-3">
                {previewQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5 ${
                      selectedOptions[currentQuestion] === index
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Great start!</h3>
              <p className="text-muted-foreground mb-6">
                Sign up to get your complete career analysis and personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/auth?tab=signup">
                  <Button size="lg" className="gap-2 px-6">
                    Get Full Results
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={resetQuiz}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};
