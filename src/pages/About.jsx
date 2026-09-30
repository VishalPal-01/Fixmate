import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Target, Heart, ShieldCheck, Zap, ArrowRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import { platformStats } from '@/data/misc'

const VALUES = [
  { icon: ShieldCheck, title: 'Trust first', description: 'Every professional is background-checked and skills-verified before they take a single booking.' },
  { icon: Zap, title: 'Speed matters', description: 'Repairs are urgent by nature. We optimize every step to get help to you faster.' },
  { icon: Heart, title: 'Fair for everyone', description: 'Transparent pricing for customers, fair pay and steady work for professionals.' },
  { icon: Target, title: 'Built on accountability', description: 'Live tracking and reviews keep both sides of every job honest and accountable.' },
]

const TEAM = [
  { name: 'Arjun Malhotra', role: 'Co-Founder & CEO', avatar: 'https://ui-avatars.com/api/?name=Arjun+Malhotra&background=1a1a2e&color=fff&size=200' },
  { name: 'Divya Nair', role: 'Co-Founder & COO', avatar: 'https://ui-avatars.com/api/?name=Divya+Nair&background=2C6EEA&color=fff&size=200' },
  { name: 'Rahul Verma', role: 'Head of Engineering', avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=0FAE82&color=fff&size=200' },
  { name: 'Simran Kaur', role: 'Head of Operations', avatar: 'https://ui-avatars.com/api/?name=Simran+Kaur&background=F5A524&color=fff&size=200' },
]

export default function About() {
  return (
    <div>
      <section className="bg-ink relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-0 bottom-0 left-1/4 w-px trace-line-v" />
          <div className="absolute top-0 bottom-0 left-3/4 w-px trace-line-v" />
        </div>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-signal/20 blur-3xl" />
        <Container className="relative text-center max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="font-mono-tag text-xs font-semibold tracking-[0.18em] uppercase text-signal">Our story</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-4 leading-tight">
              We're fixing how repairs get done
            </h1>
            <p className="mt-5 text-white/60 leading-relaxed">
              FixMate started in 2022 after our founders spent three days trying to find a
              trustworthy electrician through neighborhood WhatsApp groups. We built the platform
              we wished existed — one where finding help is as easy as ordering food.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-16 bg-white border-b border-line">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {platformStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl sm:text-4xl font-bold text-ink">{stat.value}</p>
                <p className="text-sm text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 bg-porcelain">
        <Container>
          <SectionHeading
            eyebrow="What we believe"
            title="The principles behind every decision we make"
            align="center"
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white border border-line rounded-2xl p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-signal-light flex items-center justify-center mb-4">
                  <v.icon size={20} className="text-signal" />
                </div>
                <h3 className="font-bold text-ink">{v.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 bg-white">
        <Container>
          <SectionHeading eyebrow="Leadership" title="The team behind FixMate" align="center" />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-2xl object-cover mx-auto" />
                <h3 className="font-bold text-ink mt-4">{member.name}</h3>
                <p className="text-sm text-muted">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 bg-porcelain">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-ink rounded-3xl px-8 py-12 sm:px-14 sm:py-14 text-center relative overflow-hidden"
          >
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-volt/20 blur-3xl" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white relative">
              Want to build the future of local services with us?
            </h2>
            <div className="relative mt-7">
              <Button as={Link} to="/contact" size="lg">
                Get in touch <ArrowRight size={17} />
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
