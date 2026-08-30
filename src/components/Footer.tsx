import { usePortfolio } from '../context/PortfolioContext'

export default function Footer() {
  const { data } = usePortfolio()
  const { profile } = data

  return (
    <footer className="bg-ground">
      <div className="mx-auto flex max-w-shell flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p className="label">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="label">{profile.role}</p>
        <a
          href="#top"
          className="label text-muted transition-colors duration-500 hover:text-ink"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
