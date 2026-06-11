import { getOnboardingProgress } from "./onboarding-progress";
import { HomeContent } from "./home-content";

export default async function DashboardPage() {
  const { completed, total } = await getOnboardingProgress();
  return <HomeContent onboardingCompleted={completed} onboardingTotal={total} />;
}
