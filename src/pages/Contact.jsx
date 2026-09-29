import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react'
import Container from '@/components/ui/Container'
import { Input, Textarea, Select } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { supportTopics } from '@/data/misc'

const CONTACT_METHODS = [
  { icon: Phone, title: 'Call us', value: '1800-266-3529', note: 'Mon-Sun, 7am - 11pm' },
  { icon: Mail, title: 'Email us', value: 'support@fixmate.app', note: 'Replies within 24 hours' },
  { icon: MessageCircle, title: 'Live chat', value: 'Chat with support', note: 'Available in-app' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: supportTopics[0], message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <div className="bg-porcelain min-h-screen">
      <section className="bg-white border-b border-line py-16 sm:py-20">
        <Container className="max-w-2xl text-center">
          <span className="font-mono-tag text-xs font-semibold tracking-[0.18em] uppercase text-signal">
            We're here to help
          </span>
          <h1 className="font-display text-4xl font-bold text-ink mt-4">Contact & Support</h1>
          <p className="mt-3 text-muted">
            Have a question about a booking, payment, or becoming a provider? Reach out below.
          </p>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <div className="grid lg:grid-cols-3 gap-5 mb-14">
          {CONTACT_METHODS.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white border border-line rounded-2xl p-6 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-signal-light flex items-center justify-center shrink-0">
                <m.icon size={19} className="text-signal" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{m.title}</p>
                <p className="text-sm text-ink mt-0.5">{m.value}</p>
                <p className="text-xs text-muted mt-0.5">{m.note}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-line rounded-2xl p-6 sm:p-8"
          >
            {submitted ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-volt-light flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={28} className="text-volt-dark" />
                </div>
                <h3 className="font-display text-xl font-bold text-ink">Message sent</h3>
                <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
                  Thanks for reaching out — our support team will get back to you within 24 hours.
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-xl font-bold text-ink">Send us a message</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="Full name" placeholder="Your name" value={form.name} onChange={update('name')} required />
                  <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
                </div>
                <Select label="What's this about?" value={form.topic} onChange={update('topic')}>
                  {supportTopics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
                <Textarea
                  label="Message"
                  rows={5}
                  placeholder="Tell us more about how we can help..."
                  value={form.message}
                  onChange={update('message')}
                  required
                />
                <Button type="submit" size="lg" loading={submitting}>
                  Send message <Send size={16} />
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-ink rounded-2xl p-7 h-fit relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-signal/20 blur-3xl" />
            <div className="relative">
              <MapPin size={22} className="text-signal mb-4" />
              <h3 className="font-display font-bold text-white text-lg">Our headquarters</h3>
              <p className="text-sm text-white/60 mt-2 leading-relaxed">
                FixMate Technologies Pvt. Ltd.<br />
                4th Floor, Orbit Business Park,<br />
                Vasai-Virar, Maharashtra 401202
              </p>
              <div className="h-px bg-white/10 my-6" />
              <p className="text-xs text-white/40 uppercase tracking-wide font-mono-tag mb-2">Support hours</p>
              <p className="text-sm text-white/70">Monday – Sunday</p>
              <p className="text-sm text-white/70">7:00 AM – 11:00 PM IST</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
