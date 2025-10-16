import React from 'react';
import { Hero } from '@/components/Hero';
import { FeatureCards } from '@/components/FeatureCards';
import { AboutSection } from '@/components/AboutSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { ScannerSection } from '@/components/ScannerSection';
import { ProductCatalog } from '@/components/ProductCatalog';
import { CallToAction } from '@/components/CallToAction';
import { Testimonials } from '@/components/Testimonials';
import { PartnerLogos } from '@/components/PartnerLogos';
import { SocialMedia } from '@/components/SocialMedia';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <main className="bg-white flex flex-col overflow-hidden items-stretch">
      <Hero />
      <FeatureCards />
      <AboutSection />
      <BenefitsSection />
      <ScannerSection />
      <ProductCatalog />
      <CallToAction />
      <Testimonials />
      <PartnerLogos />
      <SocialMedia />
      <Footer />
    </main>
  );
};

export default Index;
