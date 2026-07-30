import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { fetchProjectById } from '../lib/api'
import ProjectImage from '../components/ProjectImage'
import ProjectActions from '../components/ProjectActions'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Chargement... — Ilham'
    fetchProjectById(id)
      .then((data) => {
        setProject(data)
        if (data) document.title = `${data.title} — Ilham`
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-24 text-center">
        <h1 className="font-display text-3xl font-bold">Projet introuvable</h1>
        <Link to="/" className="text-accent hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  return (
    <article className="section-padding pt-32">
      <div className="container-narrow max-w-4xl">
        <Link
          to="/#projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-accent dark:text-gray-300"
        >
          <ArrowLeft size={16} />
          Retour aux projets
        </Link>

        <div className="rounded-3xl border border-gray-200 dark:border-gray-800">
          <ProjectImage
            src={project.image_url}
            alt={project.title}
            className="aspect-[21/9] w-full rounded-3xl"
            imgClassName="aspect-[21/9] w-full rounded-3xl object-cover"
          />
        </div>

        <header className="mt-10">
          <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-muted-light dark:text-muted-dark">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {(project.stack || []).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
              >
                {tech}
              </span>
            ))}
          </div>

          <ProjectActions project={project} variant="detail" />
        </header>

        {project.content && (
          <div className="prose-custom mt-12 space-y-5 border-t border-gray-200 pt-12 dark:border-gray-800">
            {project.content.split('\n\n').map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
