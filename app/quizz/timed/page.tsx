import CenterLayout from "@/components/layout/CenterLayout";
import { getAuthSession } from "@/lib/authConfig";
import { redirect } from "next/navigation";
import TimedQuiz from "@/components/quizz/TimedQuiz";

export default async function TimedExamPage() {
  const session = await getAuthSession();

  if (!session) {
    return redirect("/auth/signin");
  }

  return (
    <div className="py-8">
      <CenterLayout>
        <TimedQuiz />
      </CenterLayout>
    </div>
  );
}
