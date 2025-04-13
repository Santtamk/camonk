import { useTestContext } from "@/context/TestContext";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const TestQ = () => {
  const { questions, currentQuestionIndex, setCurrentQuestionIndex } =
    useTestContext();

  // Available words to choose from per question
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);

  // Tracks selected answers for current question's blanks
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string>
  >({});

  // Track answers for all questions
  const [allAnswers, setAllAnswers] = useState<
    Record<number, Record<number, string>>
  >({});

  // Track if the test is complete
  const [isTestComplete, setIsTestComplete] = useState<boolean>(false);

  // Track the total score
  const [score, setScore] = useState<number>(0);

  //tracks timer
  const [timer, setTimer] = useState<number>(30);

  // Current question being rendered
  const currentQuestion = questions[currentQuestionIndex];

  // Set options when the question changes
  useEffect(() => {
    if (currentQuestion) {
      setAvailableOptions(currentQuestion.options);
      setSelectedOptions({});
      setTimer(30);
    }
  }, [currentQuestion, currentQuestionIndex]);

  //for timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          // auto move to next question without checks
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else if (currentQuestionIndex === questions.length - 1) {
            calculateFinalScore();
            setIsTestComplete(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [currentQuestionIndex]);

  // Move to the next question
  const handleNextQ = () => {
    // Check if all blanks are filled
    const blankCount = (currentQuestion.question.match(/_____________/g) || [])
      .length;

    if (Object.keys(selectedOptions).length < blankCount) {
      alert("Please fill all the blanks before proceeding.");
      return;
    }

    // If this is the last question, complete the test
    if (currentQuestionIndex === questions.length - 1) {
      calculateFinalScore();
      setIsTestComplete(true);
      return;
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  // Add a selected word to a blank
  const handleSelectOption = (blankIndex: number, word: string) => {
    // Prevent selecting a word that's already been used
    const usedWords = Object.values(selectedOptions);
    if (usedWords.includes(word)) return;

    const updatedSelectedOptions = { ...selectedOptions, [blankIndex]: word };

    setSelectedOptions(updatedSelectedOptions);
    setAvailableOptions((prev) => prev.filter((item) => item !== word));

    // Save answers to allAnswers state
    setAllAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: updatedSelectedOptions,
    }));
  };

  // Remove a selected word and return it to the options
  const handleRemoveOption = (blankIndex: number) => {
    const removedOption = selectedOptions[blankIndex];
    if (!removedOption) return;

    // Update available options
    setAvailableOptions((prev) => [...prev, removedOption]);

    // Update selected options
    const updatedSelectedOptions = { ...selectedOptions };
    delete updatedSelectedOptions[blankIndex];
    setSelectedOptions(updatedSelectedOptions);

    // Update allAnswers state
    setAllAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: updatedSelectedOptions,
    }));
  };

  const calculateFinalScore = () => {
    let totalCorrect = 0;
    let totalBlanks = 0;

    questions.forEach((question, qIndex) => {
      const userAnswers = allAnswers[qIndex] || {};
      const correctAnswers = question.correctAnswer;
      const blankCount = (question.question.match(/_____________/g) || [])
        .length;

      totalBlanks += blankCount;

      // Count correct answers
      for (let i = 0; i < blankCount; i++) {
        if (userAnswers[i] === correctAnswers[i]) {
          totalCorrect++;
        }
      }
    });

    // Calculate percentage score
    const finalScore = totalBlanks > 0 ? (totalCorrect / totalBlanks) * 10 : 0;
    setScore(finalScore);
  };

  // Generate a sentence with answers for display
  const generateSentenceWithAnswers = (
    questionText: string,
    answers: Record<number, string> | string[]
  ) => {
    let result = "";
    const parts = questionText.split("_____________");

    parts.forEach((part, index) => {
      result += part;

      if (index < parts.length - 1) {
        const answer = Array.isArray(answers) ? answers[index] : answers[index];
        result += answer ? `${answer.toLowerCase()}` : "[_____________]";
      }
    });

    return result;
  };

  // "The company's _____________ approach to product development _____________ customer feedback at every stage, _____________ user satisfaction and _____________ a loyal consumer base.",
  // Split the sentence at the blanks
  const sentenceParts = currentQuestion?.question.split("_____________") || [];

  // If test is complete, show feedback
  if (isTestComplete) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Test Complete!</h1>
        <div className="text-xl">Your Score: {score.toFixed(1)} out of 10</div>

        <div className="w-full pt-4">
          {questions.map((question, qIndex) => {
            const userAnswers = allAnswers[qIndex] || {};
            const correctAnswers = question.correctAnswer;
            const blankCount = (question.question.match(/_____________/g) || [])
              .length;

            // Calculate if all answers for this question are correct
            let allCorrect = true;
            for (let i = 0; i < blankCount; i++) {
              if (userAnswers[i] !== correctAnswers[i]) {
                allCorrect = false;
                break;
              }
            }

            return (
              <div
                key={question.id}
                className="mb-18  rounded-lg bg-white shadow-2xl"
              >
                <div className="flex  justify-between p-4 ">
                  <span className="font-medium text-sm text-gray-500 bg-gray-200 rounded px-2">
                    Prompt
                  </span>
                  <span className="text-sm font-medium">
                    {" "}
                    <span className="text-gray-700">{qIndex + 1}</span>
                    <span className="text-gray-500">/10</span>
                  </span>
                </div>

                <div className="p-2 bg-white  font-normal text-base text-gray-500 px-4">
                  {generateSentenceWithAnswers(
                    question.question,
                    question.correctAnswer
                  )}
                </div>

                <div className="mt-4 bg-gray-100 p-4">
                  <div className=" mb-1">
                    <span className="font-medium text-base text-gray-500">
                      Your response:{" "}
                    </span>
                    <span>
                      {allCorrect ? (
                        <span className="text-green-500 bg-green-200 px-2 rounded">
                          Correct
                        </span>
                      ) : (
                        <span className="text-red-500 mr-2 bg-red-200 rounded px-3">
                          Incorrect
                        </span>
                        // <X className="text-red-500 mr-2" />
                      )}
                    </span>
                  </div>
                  <div className="text-lg font-normal text-gray-700">
                    {generateSentenceWithAnswers(
                      question.question,
                      userAnswers
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          onClick={() => {
            // Reset test
            setCurrentQuestionIndex(0);
            setAllAnswers({});
            setIsTestComplete(false);
            setScore(0);
          }}
          variant="secondary"
          className="bg-[#453FE1] w-[140px]  h-[42px] hover:bg- text-white px-10 py-5 cursor-pointer font-medium text-base hover:bg-white hover:text-[#453FE1] border-2 hover:shadow-2xl"
        >
          Restart Test
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10 max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-10 mt-40 px-">
      <div className="flex  justify-between w-full px-">
        {/* timer */}
        <div>00:{timer}</div>

        <Button
          variant="secondary"
          className="text-black  cursor-pointer font-medium text-base hover:bg-white hover:text-[#453FE1] border-2 hover:shadow-2xl"
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to quit? Your progress will be lost."
              )
            ) {
              setIsTestComplete(true);
            }
          }}
        >
          Quit
        </Button>
      </div>
      <div>
        <div className="pb-5 text-center">
          <span className="text-center font-semibold text-lg text-gray-500">
            Select the missing words in the correct order
          </span>
          <span className="text-sm font-medium pl-5">
            {" "}
            <span className="text-gray-700">{currentQuestionIndex + 1}</span>
            <span className="text-gray-500">/10</span>
          </span>
        </div>
        {/* question */}
        <div className="mt-4 text-lg">
          {sentenceParts.map((part, idx) => (
            <span key={idx}>
              <span className="px-10 ">{part}</span>
              {idx < sentenceParts.length - 1 &&
                (selectedOptions[idx] ? (
                  <Button
                    variant="secondary"
                    onClick={() => handleRemoveOption(idx)}
                  >
                    {selectedOptions[idx]}
                  </Button>
                ) : (
                  <span className="inline-block border-b border-gray-400 w-16"></span>
                ))}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {availableOptions.map((word, index) => {
          // Find the first empty blank to fill
          const nextBlank = Array.from(
            { length: sentenceParts.length - 1 },
            (_, i) => i
          ).find((idx) => !selectedOptions[idx]);

          return (
            <Button
              key={index}
              onClick={() =>
                nextBlank !== undefined && handleSelectOption(nextBlank, word)
              }
              variant="outline"
              disabled={nextBlank === undefined}
            >
              {word}
            </Button>
          );
        })}
      </div>
      <div className="flex items-end">
        <Button
          onClick={handleNextQ}
          variant="outline"
          className="cursor-pointer hover:bg-[#453FE1] hover:text-white"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default TestQ;
