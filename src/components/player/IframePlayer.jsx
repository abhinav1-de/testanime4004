//* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import { useMultiplayer } from "@/src/context/MultiplayerContext";

export default function IframePlayer({
  episodeId,
  serverName,
  servertype,
  animeInfo,
  episodeNum,
  episodes,
  playNext,
  autoNext, 
  aniid,
  activeServer,
}) {
  // Multiplayer integration
  const { 
    isInRoom, 
    isHost, 
    syncVideoAction, 
    roomVideoState, 
    shouldSyncVideo, 
    setShouldSyncVideo 
  } = useMultiplayer();
  
  const iframeRef = useRef(null);
  const isUpdatingFromSync = useRef(false);
  const baseURL =
    serverName.toLowerCase() === "hd-1"
      ? import.meta.env.VITE_BASE_IFRAME_URL
      : serverName.toLowerCase() === "hd-4"
      ? import.meta.env.VITE_BASE_IFRAME_URL_2
      : serverName.toLowerCase() === "nest" || servertype === "multi" || activeServer?.type === "multi"
      ? import.meta.env.VITE_BASE_IFRAME_URL_3
      : activeServer?.type === "slay"
      ? "https://slay-knight.xyz"
      : undefined; 

  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(
    episodes?.findIndex(
      (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
    )
  );

  useEffect(() => {
    const loadIframeUrl = async () => {
      setLoading(true);
      setIframeLoaded(false);
      // Clear the iframe src first to force a reload
      setIframeSrc("");
      
      // Add a small delay to ensure the iframe is cleared before setting new src
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("Loading iframe URL for:", {
        serverName,
        servertype,
        activeServer,
        baseURL,
        episodeId,
        episodeNum,
        aniid: animeInfo?.anilistId || aniid,
        animeInfo: animeInfo
      });

      if (serverName.toLowerCase() === "nest") {
        const nestUrl = `${baseURL}/${aniid}/${episodeNum}/hindi`;
        console.log("Nest URL:", nestUrl);
        setIframeSrc(nestUrl);
      } else if (activeServer?.type === "slay") {
        // Use anilistId from animeInfo if available, otherwise use aniid
        const anilistId = animeInfo?.anilistId || aniid;
        const slayLang = activeServer?.slayLang || "DUB";
        
        // Map languages to correct URL parameters based on the API response format
        let langParam;
        switch (slayLang) {
          case "ENGLISH":
            langParam = "dub";
            break;
          case "JAPANESE":
            langParam = "sub";
            break;
          case "HINDI":
            langParam = "hindi";
            break;
          case "TAMIL":
            langParam = "tamil";
            break;
          case "KANNADA":
            langParam = "kannada";
            break;
          case "MALAYALAM":
            langParam = "malayalam";
            break;
          case "TELUGU":
            langParam = "telugu";
            break;
          case "BANGLA":
            langParam = "bangla";
            break;
          default:
            langParam = "dub"; // Default to dub
        }
        
        // Construct URL following the pattern: /player/[anilist_id]/[ep]/[LANG]?autoplay=true
        const slayUrl = `${baseURL}/player/${anilistId}/${episodeNum}/${langParam}?autoplay=true`;
        console.log("=== SLAY SERVER DEBUG ===");
        console.log("Slay Knight URL:", slayUrl);
        console.log("AnilistId:", anilistId, "EpisodeNum:", episodeNum, "Lang:", slayLang, "LangParam:", langParam);
        console.log("BaseURL:", baseURL);
        console.log("AnimeInfo anilistId:", animeInfo?.anilistId);
        console.log("Fallback aniid:", aniid);
        console.log("========================");
        setIframeSrc(slayUrl);
      } else if (activeServer?.type === "multi" || serverName.toLowerCase() === "multi") {
        // Handle multi server (old Nest functionality)
        const multiUrl = `${baseURL}/${aniid}/${episodeNum}/hindi`;
        console.log("Multi URL:", multiUrl);
        setIframeSrc(multiUrl);
      } else {
        const regularUrl = `${baseURL}/${episodeId}/${servertype}`;
        console.log("Regular URL:", regularUrl);
        setIframeSrc(regularUrl);
      }
    };

    loadIframeUrl();
  }, [episodeId, servertype, serverName, animeInfo, activeServer, baseURL, aniid, episodeNum, activeServer?.slayLang, activeServer?.data_id]);

  useEffect(() => {
    if (episodes?.length > 0) {
      const newIndex = episodes.findIndex(
        (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
      );
      setCurrentEpisodeIndex(newIndex);
    }
  }, [episodeId, episodes]);

  // Handle multiplayer video sync for iframe
  useEffect(() => {
    if (shouldSyncVideo && roomVideoState && iframeRef.current && !isUpdatingFromSync.current) {
      isUpdatingFromSync.current = true;
      setShouldSyncVideo(false);

      console.log('=== IFRAME MULTIPLAYER SYNC ===');
      console.log('Syncing iframe video action:', roomVideoState.type, 'at time:', roomVideoState.currentTime, 'isHost:', isHost);

      if (!isHost) {
        // Send commands to iframe via postMessage (in case iframe supports it)
        try {
          const command = {
            type: 'MULTIPLAYER_CONTROL',
            action: roomVideoState.type,
            currentTime: roomVideoState.currentTime,
            timestamp: Date.now()
          };
          
          console.log('Sending command to iframe:', command);
          iframeRef.current.contentWindow.postMessage(command, '*');
        } catch (error) {
          console.error('Error sending command to iframe:', error);
        }
      }
      
      setTimeout(() => {
        isUpdatingFromSync.current = false;
      }, 500);
    }
  }, [shouldSyncVideo, roomVideoState, isHost, setShouldSyncVideo]);

  // Manual sync controls for host when using iframe
  const handleManualSync = (action) => {
    if (isInRoom && isHost && !isUpdatingFromSync.current) {
      console.log('Host manually syncing:', action);
      syncVideoAction({
        type: action,
        currentTime: 0 // For iframe, we can't get exact time
      });
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Received message from iframe:', event.data);
      
      const { currentTime, duration, type, action } = event.data;
      
      // Handle auto-next functionality
      if (typeof currentTime === "number" && typeof duration === "number") {
        if (
          currentTime >= duration &&
          currentEpisodeIndex < episodes?.length - 1 &&
          autoNext
        ) {
          playNext(episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]);
        }
      }
      
      // Handle multiplayer events from iframe (if the iframe supports it)
      if (isInRoom && isHost && type === 'VIDEO_STATE_CHANGE' && !isUpdatingFromSync.current) {
        console.log('Host received video state change from iframe:', action);
        if (action === 'play' || action === 'pause' || action === 'seek') {
          syncVideoAction({
            type: action,
            currentTime: currentTime || 0
          });
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [autoNext, currentEpisodeIndex, episodes, playNext, isInRoom, isHost, syncVideoAction]);

  useEffect(() => {
    setLoading(true);
    setIframeLoaded(false);
    return () => {
      const continueWatching = JSON.parse(localStorage.getItem("continueWatching")) || [];
      const newEntry = {
        id: animeInfo?.id,
        data_id: animeInfo?.data_id,
        episodeId,
        episodeNum,
        adultContent: animeInfo?.adultContent,
        poster: animeInfo?.poster,
        title: animeInfo?.title,
        japanese_title: animeInfo?.japanese_title,
      };
      if (!newEntry.data_id) return;
      const existingIndex = continueWatching.findIndex(
        (item) => item.data_id === newEntry.data_id
      );
      if (existingIndex !== -1) {
        continueWatching[existingIndex] = newEntry;
      } else {
        continueWatching.push(newEntry);
      }
      localStorage.setItem("continueWatching", JSON.stringify(continueWatching));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, servertype]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Loader Overlay */}
      <div
        className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10 transition-opacity duration-500 ${
          loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <BouncingLoader />
      </div>

      <iframe
        ref={iframeRef}
        key={`${episodeId}-${servertype}-${serverName}-${activeServer?.data_id}-${activeServer?.slayLang}-${Date.now()}`}
        src={iframeSrc}
        allowFullScreen
        allow="autoplay; fullscreen; encrypted-media"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        className={`w-full h-full transition-opacity duration-500 ${
          iframeLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => {
          setIframeLoaded(true);
          setTimeout(() => setLoading(false), 1000);
        }}
        onError={() => {
          console.error("Iframe failed to load:", iframeSrc);
          setLoading(false);
        }}
      ></iframe>
      
      {/* Multiplayer sync overlay for iframe players */}
      {isInRoom && !isHost && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg">
            {roomVideoState?.type === 'pause' ? '⏸️ Host Paused - Please pause your video' : roomVideoState?.type === 'play' ? '▶️ Host Playing - Please play your video' : '👥 Multiplayer Mode'}
          </div>
          
          {/* Manual sync button for joined users */}
          {roomVideoState?.type && (
            <div className="absolute top-4 right-4 pointer-events-auto">
              <button 
                onClick={() => {
                  // Show instruction to user
                  alert(`Host ${roomVideoState.type === 'pause' ? 'paused' : 'played'} the video. Please manually ${roomVideoState.type === 'pause' ? 'pause' : 'play'} your video to stay synchronized.`);
                }}
                className="bg-orange-600/90 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-xs font-medium"
              >
                📋 Sync Instructions
              </button>
            </div>
          )}
        </div>
      )}

      {/* Host manual sync controls for iframe */}
      {isInRoom && isHost && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-green-600/90 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg mb-2">
            👑 Host Controls - Use buttons to sync with others
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleManualSync('pause')}
              className="bg-red-600/90 hover:bg-red-700 text-white px-3 py-2 rounded text-xs font-medium"
              data-testid="button-manual-pause"
            >
              ⏸️ Sync Pause
            </button>
            <button 
              onClick={() => handleManualSync('play')}
              className="bg-blue-600/90 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-medium"
              data-testid="button-manual-play"
            >
              ▶️ Sync Play
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
