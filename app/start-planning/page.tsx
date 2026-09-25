import PageHero from "@/components/PageHero";
import PlannerQuiz from "@/components/PlannerQuiz";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Plan Your Orlando Trip: Get 10 Things To Do Picked for You",
  absoluteTitle: true,
  description:
    "Answer a few quick questions about your dates, group, interests and budget, and get a personalized list of 10 things to do in Orlando, plus where to stay.",
  path: "/start-planning",
});

export default function StartPlanningPage() {
  return (
    <>
      <PageHero
        title="Start Planning Your Orlando Trip"
        intro="Answer a few quick questions and we will pick the 10 best things to do in Orlando for your group, your interests and your budget, from real experiences with real reviews."
        crumbs={[{ name: "Start Planning", href: "/start-planning" }]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container container-narrow">
          <PlannerQuiz />
        </div>
      </section>
    </>
  );
}
