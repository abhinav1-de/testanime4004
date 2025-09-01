import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SplashScreen.css";
import logoTitle from "@/src/config/logoTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const FAQ_ITEMS = [
  {
    question: "ʜᴏᴡ ᴛᴏ ᴜꜱᴇ ᴀᴅꜰʀᴇᴇ ꜱᴇʀᴠᴇʀ?",
    answer: "ᴊᴜꜱᴛ ᴄʟɪᴄᴋ ᴏɴ ʜᴅ2 ꜰᴏʀ ᴡᴀᴛᴄʜɪɴɢ ɪᴛ ᴀᴅꜰʀᴇᴇ"
  },
  {
    question: "ᴡʜᴀᴛ ᴍᴀᴋᴇꜱ ᴢ-ᴀɴɪᴍᴇ ᴛʜᴇ ʙᴇꜱᴛ ꜱɪᴛᴇ ᴛᴏ ᴡᴀᴛᴄʜ ᴀɴɪᴍᴇ ꜰʀᴇᴇ ᴏɴʟɪɴᴇ?",
    answer: "ᴢ-ᴀɴɪᴍᴇ ᴏꜰꜰᴇʀꜱ ʜɪɢʜ-Qᴜᴀʟɪᴛʏ ꜱᴛʀᴇᴀᴍɪɴɢ, ᴀ ᴠᴀꜱᴛ ʟɪʙʀᴀʀʏ ᴏꜰ ᴀɴɪᴍᴇ, ɴᴏ ɪɴᴛʀᴜꜱɪᴠᴇ ᴀᴅꜱ, ᴀɴᴅ ᴀ ᴜꜱᴇʀ-ꜰʀɪᴇɴᴅʟʏ ɪɴᴛᴇʀꜰᴀᴄᴇ - ᴀʟʟ ᴄᴏᴍᴘʟᴇᴛᴇʟʏ ꜰʀᴇᴇ."
  },
  {
    question: "ʜᴏᴡ ᴅᴏ ɪ ʀᴇQᴜᴇꜱᴛ ᴀɴ ᴀɴɪᴍᴇ?",
    answer: "ʏᴏᴜ ᴄᴀɴ ꜱᴜʙᴍɪᴛ ᴀɴɪᴍᴇ ʀᴇQᴜᴇꜱᴛꜱ ᴛʜʀᴏᴜɢʜ ᴏᴜʀ ᴄᴏɴᴛᴀᴄᴛ ꜰᴏʀᴍ ᴏʀ ʙʏ ʀᴇᴀᴄʜɪɴɢ ᴏᴜᴛ ᴛᴏ ᴏᴜʀ ꜱᴜᴘᴘᴏʀᴛ ᴛᴇᴀᴍ."
  }
];

function SplashScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSearchSubmit = useCallback(() => {
    const trimmedSearch = search.trim();
    if (!trimmedSearch) return;
    const queryParam = encodeURIComponent(trimmedSearch);
    navigate(`/search?keyword=${queryParam}`);
  }, [search, navigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="splash-container">
      <div className="splash-overlay"></div>
      <div className="content-wrapper fade-in">
        <div className="logo-container fade-in-scale delay-200">
          <img src="/logo.png" alt={logoTitle} className="logo animate-glow" />
        </div>

        <div className="search-container fade-in delay-300">
          <input
            type="text"
            placeholder="ꜱᴇᴀʀᴄʜ ᴀɴɪᴍᴇ..."
            className="search-input glass"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ fontVariant: 'small-caps' }}
          />
          <button
            className="search-button glass-hover"
            onClick={handleSearchSubmit}
            aria-label="ꜱᴇᴀʀᴄʜ"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>

        <Link to="/home" className="enter-button glass glass-hover fade-in delay-400" style={{ fontVariant: 'small-caps' }}>
          ᴇɴᴛᴇʀ ʜᴏᴍᴇᴘᴀɢᴇ <FontAwesomeIcon icon={faAngleRight} className="angle-icon" />
        </Link>

        <div className="faq-section fade-in delay-500">
          <h2 className="faq-title" style={{ fontVariant: 'small-caps' }}>ꜰʀᴇQᴜᴇɴᴛʟʏ ᴀꜱᴋᴇᴅ Qᴜᴇꜱᴛɪᴏɴꜱ</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`faq-toggle ${expandedFaq === index ? 'rotate' : ''}`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="faq-answer">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
