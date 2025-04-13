import { createContext, ReactNode, useContext, useState } from "react";
import { Question } from "./types";

interface TestContextType {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  testStarted: boolean;
  setTestStarted: boolean;
  startTest: () => void;
  // answers: Answer[];
  // setAnswers: (answers: Answer[]) => void;
  // score: number;
  // setScore: (score: number) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]); //getting questions

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); //track questions
  const [testStarted, setTestStarted] = useState<boolean>(false); //track test start

  //   const [timer, setTimer] = useState(30); // 30seconds timer

  const startTest = async () => {
    try {
      const questionData = await fetch("http://localhost:3000/questions");
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
