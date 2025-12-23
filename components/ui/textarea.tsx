"use client";

import clsx from "clsx";
import { ComponentPropsWithoutRef, useId } from "react";

type TextAreaProps = {
  label: string;
  count: number;
  max: number;
} & ComponentPropsWithoutRef<"textarea">;

export const TextArea = ({ label, count, max, ...props }: TextAreaProps) => {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className={clsx(
          "block p-2.5 w-full min-h-[30vh] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:dark:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed",
          {
            "border-red-500 border-2 focus:ring-red-600 focus:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500":
              count < max,
          }
        )}
        placeholder="Write your thoughts here..."
        {...props}
      ></textarea>
    </div>
  );
};
