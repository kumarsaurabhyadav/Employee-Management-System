import React from 'react';
import HeroSection from '../components/landingpage/HeroSection';
import FeaturesSection from '../components/landingpage/FeaturesSection';
import PortalsSection from '../components/landingpage/PortalsSection';
import WhyChooseUs from '../components/landingpage/WhyChooseUs';
import CTAAndFooter from '../components/landingpage/CTAAndFooter';

const HomePage = () => {
  return (
    <main className="min-h-screen bg-black text-zinc-100  selection:bg-white selection:text-black font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <section>
        <HeroSection />
      </section>

      {/* Features Section */}
      <section>
        <FeaturesSection />
      </section>

      {/* Portals Section */}
      <section>
        <PortalsSection />
      </section>

      {/* Why Choose Us */}
      <section>
        <WhyChooseUs />
      </section>

      {/* CTA & Footer */}
      <section>
        <CTAAndFooter />
      </section>

    </main>
  );
};

export default HomePage;