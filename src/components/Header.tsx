import { Link } from 'react-router'
import Logo from '../assets/logo.svg'
import { webRoutes } from '../routes/webRoutes'
export default function Header() {
  return (
    <header className="bg-white">
  <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
    <a className="block text-teal-600" href="#">
      <span className="sr-only">Home</span>
        <img src={Logo} className='h-10' />
    </a>

    <div className="flex flex-1 items-center justify-end md:justify-between">
      <nav aria-label="Global" className="hidden md:block">
        <ul className="flex items-center gap-6 text-sm">
          <li>
            <Link className="text-gray-500 transition hover:text-gray-500/75" to={webRoutes.Chikhs}> Chikhs </Link>
          </li>
          <li>
            <Link className="text-gray-500 transition hover:text-gray-500/75" to={webRoutes.Subjects}> Subjects </Link>
          </li>

          <li>
            <Link className="text-gray-500 transition hover:text-gray-500/75" to={webRoutes.Videos}> Videos </Link>
          </li>
          
          <li>
            <Link className="text-gray-500 transition hover:text-gray-500/75" to={webRoutes.Calendar}> Islamic Calendar </Link>
          </li>
        </ul>
      </nav>

  
    </div>
  </div>
</header>
  )
}
