import Hero from '@/components/sections/Hero'
import CategoriesGrid from '@/components/sections/CategoriesGrid'
import HowItWorks from '@/components/sections/HowItWorks'
import FeaturedTechnicians from '@/components/sections/FeaturedTechnicians'
import StatsBand from '@/components/sections/StatsBand'
import Testimonials from '@/components/sections/Testimonials'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBand />
      <CategoriesGrid />
      <HowItWorks />
      <FeaturedTechnicians />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  )
}
