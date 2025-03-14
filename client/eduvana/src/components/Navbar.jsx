import { Link } from 'react-router-dom'
import TesseractLogo from '../assets/TesseractLogo.jsx'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <TesseractLogo />
          <span className="logo-text">EDUVANA</span>
          <span className="logo-subtext">LEARNING</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          
        </div>
        
        <div className="user-container">
          <div className="user-avatar">P</div>
          <span className="username">POLCOMPALLY</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </nav>
  )
}

export default Navbar