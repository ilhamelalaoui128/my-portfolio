import { ExternalLink, Github } from 'lucide-react'
import { hasDemoUrl, hasRepoUrl } from '../lib/projectUtils'

export default function ProjectActions({ project, variant = 'card' }) {
  const showDemo = hasDemoUrl(project.demo_url)
  const showRepo = hasRepoUrl(project.repo_url)

  if (!showDemo && !showRepo) return null

  const isCard = variant === 'card'

  return (
    <div
      className={
        isCard
          ? 'mt-5 flex gap-3'
          : 'mt-8 flex flex-wrap justify-center gap-3 sm:justify-start'
      }
    >
      {showDemo && (
        <a
          href={project.demo_url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isCard
              ? 'inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-dark'
              : 'inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-accent/20 transition hover:bg-accent-dark'
          }
        >
          <ExternalLink size={15} />
          Démo
        </a>
      )}
      {showRepo && (
        <a
          href={project.repo_url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isCard
              ? 'inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-accent/25 bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent transition hover:border-accent hover:bg-accent hover:text-white dark:border-accent/30 dark:bg-accent/10 dark:text-accent-light dark:hover:bg-accent dark:hover:text-white'
              : 'inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-accent hover:text-accent dark:border-gray-600 dark:text-gray-100'
          }
        >
          <Github size={15} />
          Code
        </a>
      )}
    </div>
  )
}
