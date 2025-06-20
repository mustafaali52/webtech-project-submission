// src/pages/Landing.jsx
import Navigation from '../components/landing-page-components/Navigation';
import HeroSection from '../components/landing-page-components/HeroSection';
import StatsSection from '../components/landing-page-components/StatsSection';
import FeaturesSection from '../components/landing-page-components/FeaturesSection';
import HowItWorksSection from '../components/landing-page-components/HowItWorksSection';
import TestimonialsSection from '../components/landing-page-components/TestimonialsSection';
import CTASection from '../components/landing-page-components/CTASection';
import Footer from '../components/landing-page-components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}