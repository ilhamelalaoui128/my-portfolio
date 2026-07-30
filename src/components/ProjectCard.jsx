import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ProjectImage from './ProjectImage'
import ProjectActions from './ProjectActions'

export default function ProjectCard({ project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-xl hover:shadow-accent/10 dark:border-gray-800 dark:bg-[#18181C] dark:hover:border-accent/40">
      <div className="h-1 bg-gradient-to-r from-accent-dark via-accent to-accent-light" />

      <Link
        to={`/projects/${project.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[#FFF4F0] dark:bg-[#18181C]"
      >
        <ProjectImage
          src={project.image_url}
          alt={project.title}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Voile chaud — neutralise les tons bleus des images externes */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-accent-deep/10 mix-blend-multiply"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101012]/80 via-[#101012]/20 to-transparent opacity-70 transition duration-300 group-hover:opacity-90"
          aria-hidden="true"
        />

        {project.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow-md shadow-accent/30">
            En vedette
          </span>
        )}

        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-lg shadow-accent/30 transition duration-300 group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link to={`/projects/${project.id}`} className="no-underline">
          <h3 className="font-display text-xl font-bold text-gray-900 transition group-hover:text-accent dark:text-white">
            {project.title}
          </h3>
        </Link>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-light dark:text-muted-dark">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(project.stack || []).slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-accent/15 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-dark dark:border-accent/20 dark:bg-accent/15 dark:text-accent-light"
            >
              {tech}
            </span>
          ))}
        </div>

        <ProjectActions project={project} variant="card" />
      </div>
    </article>
  )
}
