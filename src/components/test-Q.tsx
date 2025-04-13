import { useTestContext } from "@/context/TestContext";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const TestQ = () => {
  const { questions, currentQuestionIndex, setCurrentQuestionIndex } =
    useTestContext();
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<
    Record<number, string[]>
  >({});

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion) {
      setAvailableOptions(currentQuestion.options);
    }
  }, [currentQuestion, currentQuestionIndex]);

  const handleNextQ = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSelectedOption = (option: string) => {
    setAvailableOptions((prev) => prev.filter((item) => item !== option));
    setSelectedOption((prev) => {
      const current = prev[currentQuestionIndex] || [];
      return {
        ...prev,
        [currentQuestionIndex]: [...current, option],
      };
    });
  };

  const handleRemoveSelectedWord = (word: string) => {
    setSelectedOption((prev) => {
      const current = prev[currentQuestionIndex] || [];
      return {
        ...prev,
        [currentQuestionIndex]: current.filter((item) => item !== word),
      };
    });
    setAvailableOptions((prev) => [...prev, word]);
  };

  return (
    <div>
      <div>{/* timer */}</div>
      <div>{/* exit */}</div>
      <div>
        <div>{/* keep track of question sung color change slider */}</div>
        <div>Select the missing words in the correct order</div>
        {/* question */}
        <div>{questions[currentQuestionIndex]?.question}</div>
        <div>
          {(selectedOption[currentQuestionIndex] || []).map((option, index) => (
            <Button
              key={index}
              onClick={() => handleRemoveSelectedWord(option)}
              variant="outline"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div>
        {/* options */}
        {availableOptions.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleSelectedOption(option)}
            variant="outline"
          >
            {option}
          </Button>
        ))}
      </div>
      <div>
        <Button
          onClick={handleNextQ}
          variant="outline"
          className="cursor-pointer hover:bg-[#453FE1] hover:text-white"
        >
          {" "}
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default TestQ;
