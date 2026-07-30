import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Timeline from '../components/Timeline'
import Experiences from '../components/Experiences'
import ContactForm from '../components/ContactForm'
import SectionDivider from '../components/SectionDivider'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <SectionDivider className="py-6 md:py-8" />
      <Skills />
      <SectionDivider className="py-6 md:py-8" />
      <Projects />
      <SectionDivider className="py-6 md:py-8" />
      <Timeline />
      <SectionDivider className="py-6 md:py-8" />
      <Experiences />
      <SectionDivider className="py-6 md:py-8" />
      <ContactForm />
    </>
  )
}
