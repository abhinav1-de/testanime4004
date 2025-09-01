import { FaChevronLeft } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faRandom, faHome, faClock, faFire, faTv, faPlay, faCirclePlay, faFilePen } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const MENU_ITEMS = [
  { name: "ʜᴏᴍᴇ", path: "/home", icon: faHome },
  { name: "ʀᴇᴄᴇɴᴛʟʏ ᴀᴅᴅᴇᴅ", path: "/recently-added", icon: faCirclePlay },
  { name: "ᴛᴏᴘ ᴜᴘᴄᴏᴍɪɴɢ", path: "/top-upcoming", icon: faFilePen },
  { name: "ꜱᴜʙʙᴇᴅ ᴀɴɪᴍᴇ", path: "/subbed-anime", icon: faFilePen },
  { name: "ᴅᴜʙʙᴇᴅ ᴀɴɪᴍᴇ", path: "/dubbed-anime", icon: faPlay },
  { name: "ᴍᴏꜱᴛ ᴘᴏᴘᴜʟᴀʀ", path: "/most-popular", icon: faFire },
  { name: "ᴍᴏᴠɪᴇꜱ", path: "/movie", icon: faFilm },
  { name: "ᴛᴠ ꜱᴇʀɪᴇꜱ", path: "/tv", icon: faTv },
  { name: "ᴏᴠᴀꜱ", path: "/ova", icon: faCirclePlay },
  { name: "ᴏɴᴀꜱ", path: "/ona", icon: faPlay },
  { name: "ꜱᴘᴇᴄɪᴀʟꜱ", path: "/special", icon: faClock },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const scrollPosition = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!isOpen) {
        scrollPosition.current = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollPosition.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition.current);
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [location]);

  return (
    <div className="sidebar-container" aria-hidden={!isOpen}>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar-main ${isOpen ? 'sidebar-open' : ''} glass`}
        role="dialog"
        aria-modal="true"
        style={{ fontVariant: 'small-caps' }}
      >
        <div className="sidebar-content">
          {/* Header */}
          <div className="sidebar-header fade-in">
            <button
              onClick={onClose}
              className="close-button glass-hover"
            >
              <FaChevronLeft className="text-sm" />
              <span className="text-sm font-medium">ᴄʟᴏꜱᴇ ᴍᴇɴᴜ</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="quick-actions-grid">
              <Link
                to="/random"
                className="quick-action-item glass-hover fade-in delay-100"
              >
                <FontAwesomeIcon icon={faRandom} className="text-lg" />
                <span className="text-xs font-medium">ʀᴀɴᴅᴏᴍ</span>
              </Link>
              <Link
                to="/movie"
                className="quick-action-item glass-hover fade-in delay-200"
              >
                <FontAwesomeIcon icon={faFilm} className="text-lg" />
                <span className="text-xs font-medium">ᴍᴏᴠɪᴇ</span>
              </Link>
              <div className="quick-action-item glass-hover fade-in delay-300">
                <div className="language-switcher">
                  {["ᴇɴ", "ᴊᴘ"].map((lang, index) => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(index === 0 ? "EN" : "JP")}
                      className={`lang-button ${language === (index === 0 ? "EN" : "JP") ? 'active' : ''}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-medium text-white/60">ʟᴀɴɢᴜᴀɢᴇ</span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="menu-items">
            {MENU_ITEMS.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`menu-item glass-hover fade-in delay-${(index + 4) * 100}`}
              >
                <FontAwesomeIcon icon={item.icon} className="text-lg w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
