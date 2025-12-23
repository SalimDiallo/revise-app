import GenerateAiQuestion from "@/components/quizz/GenerateAiQuestion";
import CenterLayout from "@/components/layout/CenterLayout";
import { getAuthSession } from "@/lib/authConfig";
import { userCountQuizz } from "@/lib/data";
import React from "react";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getAuthSession();

  if (!session?.user.id) {
    redirect("/");
  }
  const countUserGameQuizz = await userCountQuizz(session?.user.id ?? "");
  return (
    <div>
      <CenterLayout>
        <GenerateAiQuestion countMax={countUserGameQuizz?.usageMax ?? 0} />
      </CenterLayout>
    </div>
  );
};

export default page;
