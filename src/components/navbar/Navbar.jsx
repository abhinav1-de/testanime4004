import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRandom,
  faMagnifyingGlass,
  faXmark,
  faUsers,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { SearchProvider } from "@/src/context/SearchContext";
import WebSearch from "../searchbar/WebSearch";
import MobileSearch from "../searchbar/MobileSearch";
import { useMultiplayer } from "@/src/context/MultiplayerContext";

function Navbar() {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const { isInRoom, joinRoom, roomError } = useMultiplayer();
  const [isNotHomePage, setIsNotHomePage] = useState(
    location.pathname !== "/" && location.pathname !== "/home"
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showJoinPanel, setShowJoinPanel] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');

  const handleJoinRoom = () => {
    if (roomCode.trim() && username.trim()) {
      joinRoom(roomCode.trim(), username.trim());
      setShowJoinPanel(false);
      setRoomCode('');
      setUsername('');
    }
  };

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

          {/* Right Section - Join Room & Language */}
          <div className="hidden md:flex items-center gap-3">
            {/* Join Room Button */}
            {!isInRoom && (
              <button
                onClick={() => setShowJoinPanel(true)}
                className="glass-morphism bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-500/90 hover:to-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/10 fade-in delay-500"
                style={{ fontVariant: 'small-caps' }}
                title="ᴊᴏɪɴ ᴍᴜʟᴛɪᴘʟᴀʏᴇʀ ʀᴏᴏᴍ"
              >
                <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
                <span className="text-sm font-medium">ᴊᴏɪɴ ʀᴏᴏᴍ</span>
              </button>
            )}
            
            {/* Language Toggle */}
            <div className="flex items-center gap-2 glass rounded-lg p-1 border border-white/10">
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

        {/* Join Room Modal */}
        {showJoinPanel && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000001] fade-in p-3 sm:p-4">
            <div className="glass-morphism bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/20 rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md shadow-2xl fade-in-scale mx-auto my-auto max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold" style={{ fontVariant: 'small-caps' }}>ᴊᴏɪɴ ʀᴏᴏᴍ</h3>
                <button
                  onClick={() => setShowJoinPanel(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200 glass-hover p-1.5 sm:p-2 rounded-lg"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="fade-in delay-100">
                  <label className="block text-gray-300 text-xs mb-1.5 sm:mb-2" style={{ fontVariant: 'small-caps' }}>ᴇɴᴛᴇʀ ʏᴏᴜʀ ᴜꜱᴇʀɴᴀᴍᴇ</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 glass bg-gray-800/50 text-white rounded-lg border border-gray-600/50 focus:border-blue-500/80 focus:outline-none transition-all duration-200 backdrop-blur-sm text-sm"
                    placeholder="ᴇɴᴛᴇʀ ʏᴏᴜʀ ᴜꜱᴇʀɴᴀᴍᴇ"
                    style={{ fontVariant: 'small-caps' }}
                  />
                </div>

                <div className="fade-in delay-200">
                  <label className="block text-gray-300 text-xs mb-1.5 sm:mb-2" style={{ fontVariant: 'small-caps' }}>ʀᴏᴏᴍ ᴄᴏᴅᴇ</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="w-full px-3 py-2 glass bg-gray-800/50 text-white rounded-lg border border-gray-600/50 focus:border-blue-500/80 focus:outline-none transition-all duration-200 backdrop-blur-sm text-sm"
                    placeholder="ᴇɴᴛᴇʀ ʀᴏᴏᴍ ᴄᴏᴅᴇ (ᴇ.ɢ. 57382)"
                    style={{ fontVariant: 'small-caps' }}
                  />
                </div>

                <button
                  onClick={handleJoinRoom}
                  disabled={!roomCode.trim() || !username.trim()}
                  className="w-full glass-morphism bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-500/90 hover:to-purple-500/90 disabled:from-gray-600/50 disabled:to-gray-600/50 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/10 fade-in delay-300 flex items-center justify-center gap-2 text-sm"
                  style={{ fontVariant: 'small-caps' }}
                >
                  <span>ᴊᴏɪɴ ʀᴏᴏᴍ</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                </button>

                {roomError && (
                  <div className="text-red-400 text-xs text-center fade-in mt-2" style={{ fontVariant: 'small-caps' }}>
                    {roomError}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      </nav>
    </SearchProvider>
  );
}

export default Navbar;
