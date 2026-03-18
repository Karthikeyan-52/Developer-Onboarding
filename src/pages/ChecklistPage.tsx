import OnboardingChecklist from "@/components/OnboardingChecklist";

export default function ChecklistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Onboarding Checklist</h1>
        <p className="text-sm text-muted-foreground">
          Role-based steps to get you productive. Select your role and track your progress.
        </p>
      </div>
      <OnboardingChecklist />
    </div>
  );
}