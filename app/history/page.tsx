import CenterLayout from "@/components/layout/CenterLayout";
import { getAuthSession } from "@/lib/authConfig";
import { redirect } from "next/navigation";
import HistoryPage from "@/components/history/HistoryPage";

export default async function History() {
  const session = await getAuthSession();

  if (!session) {
    return redirect("/auth/signin");
  }

  return (
    <div className="py-8">
      <CenterLayout>
        <HistoryPage />
      </CenterLayout>
    </div>
  );
}
