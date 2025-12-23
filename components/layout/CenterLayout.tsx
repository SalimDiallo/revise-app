import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";

const CenterLayout = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={cn(
        "max-w-4xl mx-auto p-2 max-md:w-full max-md:px-2  max-md:text-xs",
        className
      )}
    >
      {children}
    </div>
  );
};

export default CenterLayout;
