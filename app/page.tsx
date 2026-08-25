import { ContributeCta } from "@/components/home/ContributeCta";
import { Hero } from "@/components/home/Hero";
import { LearningLoop } from "@/components/home/LearningLoop";
import { LevelGrid } from "@/components/home/LevelGrid";
import { Stats } from "@/components/home/Stats";
import { VerificationModel } from "@/components/home/VerificationModel";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <LevelGrid />
      <LearningLoop />
      <VerificationModel />
      <ContributeCta />
    </>
  );
}
