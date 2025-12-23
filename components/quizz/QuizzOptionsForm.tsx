"use client";
import { Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { QuizQuestion } from "@/lib/data";
import { AlertCircle, CheckCircle } from "lucide-react";

export type optionType = {
  value: string;
  id: "choiceA" | "choiceB" | "choiceC" | "choiceD" | undefined;
};

export function QuizzOptionsForm({
  question,
  isSubmit = false,
  option,
  setOption,
}: {
  question: QuizQuestion | null;
  isSubmit: boolean;
  option: optionType;
  setOption: (value: React.SetStateAction<optionType>) => void;
}) {
  const ids: optionType["id"][] = ["choiceA", "choiceB", "choiceC", "choiceD"];
  return (
    <div>
      {question?.options.map((el, index) => (
        <Option
          key={`${el}-${index}`}
          isSubmit={isSubmit}
          correctAnswer={question.correctAnswer}
          id={ids[index]}
          value={el}
          currentOptionId={option.id}
          setOption={setOption}
        />
      ))}
    </div>
  );
}

export const Option = ({
  id,
  value,
  currentOptionId,
  setOption,
  isSubmit = false,
  correctAnswer,
}: {
  value: string;
  setOption: Dispatch<SetStateAction<optionType>>;
  id: optionType["id"];
  currentOptionId: optionType["id"];
  isSubmit: boolean;
  correctAnswer: string;
}) => {
  const isSelected = currentOptionId === id;
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        setOption({
          value: value,
          id: id,
        });
      }}
      className={cn(
        "flex border border-accent rounded-sm  my-4 text-start justify-between items-center whitespace-normal p-4 ",
        {
          "border-blue-600": isSelected,
          "border-green-600":
            value === correctAnswer &&
            isSubmit &&
            currentOptionId !== undefined,
          "border-red-600": isSelected && value !== correctAnswer && isSubmit,
        }
      )}
    >
      <label htmlFor={id}>{value}</label>
      <Input className="hidden" type="radio" id={id} name="quizz"></Input>
      {isSelected && value !== correctAnswer && isSubmit && (
        <AlertCircle color="red" />
      )}
      {value === correctAnswer && isSubmit && currentOptionId !== undefined && (
        <CheckCircle color="green" />
      )}
    </div>
  );
};
