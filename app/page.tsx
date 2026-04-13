import Hero from "@/components/Hero";
import PlanComparison from "@/components/PlanComparison";
import ROICalculator from "@/components/ROICalculator";
import DrawdownVisualizer from "@/components/DrawdownVisualizer";
import ConsistencyChecker from "@/components/ConsistencyChecker";
import AIRecommendation from "@/components/AIRecommendation";
import Footer from "@/components/Footer";
import FadeInSection from "@/components/FadeInSection";

function SectionDivider() {
  return <div className="section-divider mx-auto max-w-5xl" />;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <SectionDivider />
      <FadeInSection>
        <PlanComparison />
      </FadeInSection>
      <SectionDivider />
      <FadeInSection>
        <ROICalculator />
      </FadeInSection>
      <SectionDivider />
      <FadeInSection>
        <DrawdownVisualizer />
      </FadeInSection>
      <SectionDivider />
      <FadeInSection>
        <ConsistencyChecker />
      </FadeInSection>
      <SectionDivider />
      <FadeInSection>
        <AIRecommendation />
      </FadeInSection>
      <FadeInSection>
        <Footer />
      </FadeInSection>
    </main>
  );
}
