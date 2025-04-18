import { Link } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../assets/logo.svg'
import { webRoutes } from '../routes/webRoutes'
import UserProfileButton from './UserProfileButton'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link to={webRoutes.home} className="block text-teal-600">
          <span className="sr-only">Home</span>
          <img src={Logo} className='h-10' alt="FiSabilLah Logo" />
        </Link>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link className="text-gray-500 transition hover:text-gray-500/75" to={webRoutes.Chikhs}> Chikhs </Link>
              </li>
              <li>
                <Link className="text-gray-500 transition hover:text-gray-500/75" to={webRoutes.Calendar}> Islamic Calendar </Link>
              </li>
           
              <li>
                <Link className="text-gray-500 transition hover:text-gray-500/75" to={webRoutes.SocialAccounts}> Social account </Link>
              </li>
              <li>
                <Link className="text-gray-500 transition hover:text-gray-500/75" to={webRoutes.ScheduledPosts}> Scheduled Posts </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <UserProfileButton />
            
            <button 
              className="block md:hidden rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="flex flex-col p-4">
            <Link 
              className="py-2 text-gray-700 hover:text-emerald-600" 
              to={webRoutes.Chikhs}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chikhs
            </Link>
            <Link 
              className="py-2 text-gray-700 hover:text-emerald-600" 
              to={webRoutes.Subjects}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Subjects
            </Link>
            <Link 
              className="py-2 text-gray-700 hover:text-emerald-600" 
              to={webRoutes.Videos}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Videos
            </Link>
            <Link 
              className="py-2 text-gray-700 hover:text-emerald-600" 
              to={webRoutes.Calendar}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Islamic Calendar
            </Link>
            <Link 
              className="py-2 text-gray-700 hover:text-emerald-600" 
              to={webRoutes.Tags}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tags
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
