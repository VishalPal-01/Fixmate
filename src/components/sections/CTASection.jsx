import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export default function CTASection() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 sm:px-16 sm:py-16 text-center"
        >
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-signal/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-volt/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white max-w-xl mx-auto">
              Something needs fixing? Get a verified pro moving in minutes.
            </h2>
            <p className="mt-4 text-white/60 max-w-md mx-auto">
              Join thousands of households who've stopped guessing who to call.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button as={Link} to="/search" size="lg">
                Book a service <ArrowRight size={18} />
              </Button>
              <Button as={Link} to="/register?role=provider" size="lg" variant="outline" className="!bg-transparent !text-white !border-white/20 hover:!bg-white/10">
                Join as a professional
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
