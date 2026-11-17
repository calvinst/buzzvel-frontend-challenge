import { Header } from "@/components/Header";
import {
  Categories,
  Contact,
  Featured,
  FinalCta,
  Footer,
  Hero,
  HowItWorks,
  People,
  Testimonial,
} from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Categories />
        <Featured />
        <HowItWorks />
        <Testimonial />
        <People />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
