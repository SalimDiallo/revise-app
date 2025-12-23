import CenterLayout from "@/components/layout/CenterLayout";
import { getAuthSession } from "@/lib/authConfig";
import { redirect } from "next/navigation";
import StatsPage from "@/components/stats/StatsPage";

export default async function Statistics() {
  const session = await getAuthSession();

  if (!session) {
    return redirect("/auth/signin");
  }

  return (
    <div className="py-8">
      <CenterLayout>
        <StatsPage />
      </CenterLayout>
    </div>
  );
}
