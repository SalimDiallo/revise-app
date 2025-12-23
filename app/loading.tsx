import CenterLayout from "@/components/layout/CenterLayout";
import { Loader } from "@/components/ui/loader";
import React from "react";

const Loading = () => {
  return (
    <CenterLayout className="flex justify-center items-center min-h-max h-24">
      <Loader />
    </CenterLayout>
  );
};

export default Loading;
