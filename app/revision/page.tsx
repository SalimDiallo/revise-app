import CenterLayout from "@/components/layout/CenterLayout";
import { getAuthSession } from "@/lib/authConfig";
import { redirect } from "next/navigation";
import RevisionMode from "@/components/revision/RevisionMode";

export default async function RevisionPage() {
  const session = await getAuthSession();

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="py-8">
      <CenterLayout>
        <RevisionMode />
      </CenterLayout>
    </div>
  );
}
