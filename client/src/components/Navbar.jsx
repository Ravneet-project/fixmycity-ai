import {
  Bell,
  ChevronDown,
  Search,
  Sparkles,
} from "lucide-react";

const Navbar = () => {
  return (
    <header className="navbar-wrapper">
      <nav className="navbar container">
        <a href="/" className="brand">
          <div className="brand-icon">
            <span></span>
            <span></span>
          </div>

          <div className="brand-text">
            FixMyCity <span>AI</span>
          </div>
        </a>

        <div className="nav-links">
          <a href="#home" className="nav-link active">
            Home
          </a>

          <a href="#report" className="nav-link">
            Report
          </a>

          <a href="#explore" className="nav-link">
            Explore
          </a>

          <a href="#impact" className="nav-link">
            Impact
          </a>

          <a href="#about" className="nav-link">
            About
          </a>
        </div>

        <div className="nav-actions">
          <div className="nav-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search issues, locations..."
            />
          </div>

          <button className="icon-button">
            <Bell size={19} />
            <span className="notification-dot"></span>
          </button>

          <button className="profile-button">
            <div className="profile-avatar">
              R
            </div>

            <span>Ravneet</span>

            <ChevronDown size={15} />
          </button>
        </div>

        <button className="mobile-ai-button">
          <Sparkles size={18} />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;