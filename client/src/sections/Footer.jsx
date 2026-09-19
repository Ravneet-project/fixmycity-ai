import {
  Code2,
  Heart,
  Mail,
  MapPin,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="about" className="footer">
      <div className="footer-glow"></div>

      <div className="container footer-container">
        <div className="footer-top">
          {/* BRAND */}
          <div className="footer-brand-area">
            <a href="#home" className="footer-brand">
              <div className="brand-icon">
                <span></span>
                <span></span>
              </div>

              <div className="brand-text">
                FixMyCity <span>AI</span>
              </div>
            </a>

            <p>
              AI-powered civic reporting for cleaner, safer and smarter cities.
              Report local issues, track their progress and help create real
              change in your community.
            </p>

            <div className="footer-built">
              <Sparkles size={14} />
              <span>Built for HackDevengers 2.0</span>
            </div>
          </div>

          {/* PLATFORM */}
          <div className="footer-links-group">
            <h4>Platform</h4>

            <a href="#home">
              Home
            </a>

            <a href="#report">
              Report Issue
            </a>

            <a href="#explore">
              Explore Issues
            </a>

            <a href="#impact">
              Impact
            </a>
          </div>

          {/* TECHNOLOGY */}
          <div className="footer-links-group">
            <h4>Technology</h4>

            <span>React + Vite</span>
            <span>Framer Motion</span>
            <span>AI Vision Analysis</span>
            <span>Smart Civic Intelligence</span>
          </div>

          {/* CONNECT */}
          <div className="footer-links-group">
            <h4>Connect</h4>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code2 size={14} />
              GitHub
              <ExternalLink size={11} />
            </a>

            <a href="mailto:your-email@example.com">
              <Mail size={14} />
              Contact
            </a>

            <span>
              <MapPin size={14} />
              India
            </span>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <span>
            © {currentYear} FixMyCity AI. All rights reserved.
          </span>

          <span className="footer-love">
            Made with
            <Heart
              size={13}
              fill="currentColor"
            />
            for better cities
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;