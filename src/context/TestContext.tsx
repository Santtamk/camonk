import { createContext, ReactNode, useContext, useState } from "react";
import { Question } from "./types";

interface TestContextType {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  testStarted: boolean;
  setTestStarted: (value: boolean) => void;
  startTest: () => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]); //getting questions

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); //track questions
  const [testStarted, setTestStarted] = useState<boolean>(false); //track test start

  const startTest = async () => {
    try {
      const questionData = await fetch(
        "https://run.mocky.io/v3/36ec56e5-312d-449b-8041-960df801856a"
      );
      const json = await questionData.json();
      setQuestions(json);
      setTestStarted(true);
    } catch (err) {
      console.error(
        "check testContext or db.json or make sure JSON Server is running",
        err
      );
    }
  };

  // const timerChecker = ()

  return (
    <TestContext.Provider
      value={{
        setTestStarted,
        questions,
        startTest,
        testStarted,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        setQuestions,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error("error with context provider");
  }
  return context;
};
