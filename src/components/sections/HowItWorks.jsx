import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { howItWorks } from '@/data/misc'

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-ink relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div className="absolute top-0 bottom-0 left-1/4 w-px trace-line-v" />
        <div className="absolute top-0 bottom-0 left-2/4 w-px trace-line-v" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px trace-line-v" />
      </div>
      <Container className="relative">
        <SectionHeading
          eyebrow="The process"
          title="From broken to booked in four steps"
          description="Every request follows the same transparent path, so you always know what happens next."
          light
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
          <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px trace-line" />
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/[0.07] border border-white/10 flex items-center justify-center font-display font-bold text-signal text-lg mb-5 relative z-10">
                0{item.step}
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
