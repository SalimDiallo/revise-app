import { QuizQuestion } from "@/lib/data";
import { create } from "zustand";

type Action = {
  data: QuizQuestion[] | null;
  updateQuizzData: (QuizzData: QuizQuestion[]) => void;
};

export const UseQUizzStore = create<Action>((set) => ({
  data: null,
  updateQuizzData: (data) => {
    set((state) => {
      state.data = data;
      return state;
    });
  },
}));
