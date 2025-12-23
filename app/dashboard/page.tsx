import CenterLayout from "@/components/layout/CenterLayout";
import { getAuthSession } from "@/lib/authConfig";
import { userCountQuizz } from "@/lib/data";
import { redirect } from "next/navigation";
import { DashboardStats, DashboardActions, RecentActivity } from "@/components/ui/DashboardComponents";

const DashboardPage = async () => {
  const session = await getAuthSession();

  if (!session) {
    return redirect("/");
  }

  const countUserGameQuizz = await userCountQuizz(session.user.id ?? "");

  // Mock data for recent activities (à remplacer par vraies données)
  const recentActivities: any[] = [];

  return (
    <div className="py-8">
      <CenterLayout>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bonjour, {session.user.name?.split(" ")[0] || "Utilisateur"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici un aperçu de votre progression
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <DashboardStats 
            usageMax={countUserGameQuizz?.usageMax ?? 0} 
            totalQuizzes={0}
            averageScore={0}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Actions rapides</h2>
          <DashboardActions />
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-medium mb-4">Historique</h2>
          <RecentActivity activities={recentActivities} />
        </div>
      </CenterLayout>
    </div>
  );
};

export default DashboardPage;
