import Hero from "@/components/Hero";
import PlanComparison from "@/components/PlanComparison";
import ROICalculator from "@/components/ROICalculator";
import DrawdownVisualizer from "@/components/DrawdownVisualizer";
import ConsistencyChecker from "@/components/ConsistencyChecker";
import AIRecommendation from "@/components/AIRecommendation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <PlanComparison />
      <ROICalculator />
      <DrawdownVisualizer />
      <ConsistencyChecker />
      <AIRecommendation />
      <Footer />
    </main>
  );
}
