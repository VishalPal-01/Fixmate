import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { faqs } from '@/data/misc'

export default function FAQSection() {
  const [openId, setOpenId] = useState(faqs[0].id)

  return (
    <section className="py-20 lg:py-28 bg-porcelain">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Common questions" align="center" />

        <div className="mt-10 space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <div key={faq.id} className="bg-white border border-line rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-ink text-sm sm:text-base">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 w-7 h-7 rounded-full bg-porcelain flex items-center justify-center"
                  >
                    <Plus size={15} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-muted leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
