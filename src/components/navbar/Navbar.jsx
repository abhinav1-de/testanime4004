import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRandom,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { SearchProvider } from "@/src/context/SearchContext";
import WebSearch from "../searchbar/WebSearch";
import MobileSearch from "../searchbar/MobileSearch";

function Navbar() {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [isNotHomePage, setIsNotHomePage] = useState(
    location.pathname !== "/" && location.pathname !== "/home"
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleHamburgerClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleRandomClick = () => {
    if (location.pathname === "/random") {
      window.location.reload();
    }
  };

  useEffect(() => {
    setIsNotHomePage(
      location.pathname !== "/" && location.pathname !== "/home"
    );
  }, [location.pathname]);

  return (
    <SearchProvider>
      <nav
        className={`fixed top-0 left-0 w-full z-[1000000] transition-all duration-500 ease-in-out glass-hover fade-in
          ${isScrolled ? "glass backdrop-blur-xl border-b border-white/10" : "bg-gradient-to-r from-black/90 via-black/80 to-black/90"}`}
        style={{ fontVariant: 'small-caps' }}
      >
        <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faBars}
                className="text-xl text-gray-200 cursor-pointer hover:text-white transition-all duration-300 hover:scale-110 glass-hover p-2 rounded-lg"
                onClick={handleHamburgerClick}
                title="ᴍᴇɴᴜ"
              />
              <Link to="/home" className="flex items-center">
                <img src="/logo.png" alt="ᴊᴜꜱᴛᴀɴɪᴍᴇ ʟᴏɢᴏ" className="h-9 w-auto fade-in-scale" />
              </Link>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 flex justify-center items-center max-w-none mx-8 hidden md:flex">
            <div className="flex items-center gap-2 w-[600px]">
              <WebSearch />
              <Link
                to={location.pathname === "/random" ? "#" : "/random"}
                onClick={handleRandomClick}
                className="p-[10px] aspect-square glass glass-hover text-white/70 hover:text-white rounded-lg transition-all duration-300 flex items-center justify-center animate-glow"
                title="ʀᴀɴᴅᴏᴍ ᴀɴɪᴍᴇ"
              >
                <FontAwesomeIcon icon={faRandom} className="text-lg" />
              </Link>
            </div>
          </div>

          {/* Language Toggle - Desktop */}
            <div className="hidden md:flex items-center gap-2 glass rounded-lg p-1 border border-white/10">
              {["ᴇɴ", "ᴊᴘ"].map((lang, index) => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(index === 0 ? "EN" : "JP")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    language === (index === 0 ? "EN" : "JP")
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg animate-glow"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  style={{ fontVariant: 'small-caps' }}
                >
                  {lang}
                </button>
              ))}
            </div>

          {/* Mobile Search Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-[10px] aspect-square glass glass-hover text-white/70 hover:text-white rounded-lg transition-all duration-300 flex items-center justify-center w-[38px] h-[38px]"
              title={isMobileSearchOpen ? "ᴄʟᴏꜱᴇ ꜱᴇᴀʀᴄʜ" : "ꜱᴇᴀʀᴄʜ ᴀɴɪᴍᴇ"}
            >
              <FontAwesomeIcon 
                icon={isMobileSearchOpen ? faXmark : faMagnifyingGlass} 
                className="w-[18px] h-[18px] transition-transform duration-200"
                style={{ transform: isMobileSearchOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isMobileSearchOpen && (
          <div className="md:hidden glass border-t border-white/10 shadow-2xl backdrop-blur-xl fade-in">
            <MobileSearch onClose={() => setIsMobileSearchOpen(false)} />
        </div>
        )}

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      </nav>
    </SearchProvider>
  );
}

export default Navbar;
