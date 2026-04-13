import Hero from "@/components/Hero";
import PlanComparison from "@/components/PlanComparison";
import ROICalculator from "@/components/ROICalculator";
import DrawdownVisualizer from "@/components/DrawdownVisualizer";
import ConsistencyChecker from "@/components/ConsistencyChecker";
import AIRecommendation from "@/components/AIRecommendation";
import Footer from "@/components/Footer";

function SectionDivider() {
  return <div className="section-divider mx-auto max-w-5xl" />;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <SectionDivider />
      <PlanComparison />
      <SectionDivider />
      <ROICalculator />
      <SectionDivider />
      <DrawdownVisualizer />
      <SectionDivider />
      <ConsistencyChecker />
      <SectionDivider />
      <AIRecommendation />
      <Footer />
    </main>
  );
}
