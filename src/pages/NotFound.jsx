import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search, Wrench } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center bg-porcelain relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.35] pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-px h-32 trace-line-v" />
        <div className="absolute bottom-1/4 right-1/5 w-40 h-px trace-line" />
      </div>
      <Container className="relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-2xl bg-ink flex items-center justify-center mx-auto mb-8 rotate-6"
        >
          <Wrench size={32} className="text-signal -rotate-6" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-7xl sm:text-8xl font-bold text-ink"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-3 text-lg font-semibold text-ink"
        >
          This page couldn't be fixed.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2 text-muted max-w-sm mx-auto"
        >
          The page you're looking for doesn't exist or may have moved. Let's get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button as={Link} to="/" size="lg">
            <Home size={17} /> Back to home
          </Button>
          <Button as={Link} to="/search" size="lg" variant="outline">
            <Search size={17} /> Find a professional
          </Button>
        </motion.div>
      </Container>
    </div>
  )
}
