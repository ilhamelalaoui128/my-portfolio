import SectionHeading from './SectionHeading'
import ScrollReveal from './ScrollReveal'
import ProjectCard from './ProjectCard'
import { usePortfolioData } from '../context/PortfolioDataContext'

export default function Projects() {
  const { projects } = usePortfolioData()

  if (!projects) return null

  return (
    <section id="projects" className="section-padding bg-surface-light dark:bg-surface-dark">
      <div className="container-narrow">
        <SectionHeading
          label="Portfolio"
          title="Projets récents"
          description="Une sélection de réalisations — du concept au déploiement."
        />

        <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.08}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
  )
}
