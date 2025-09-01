/* eslint-disable react/prop-types */
import {
  faClosedCaptioning,
  faFile,
  faMicrophone,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import "./Servers.css";
import { useEffect } from "react";
import { useMultiplayer } from "@/src/context/MultiplayerContext";
import { faUsers, faPlus } from "@fortawesome/free-solid-svg-icons";

function Servers({
  servers,
  activeEpisodeNum,
  activeServerId,
  setActiveServerId,
  serverLoading,
  setActiveServerType,
  setActiveServerName,
}) {
  // Multiplayer integration - only show iframe compatible servers when in room
  const { isInRoom, createRoom, nickname, setNickname } = useMultiplayer();
  
  const handleCreateRoom = () => {
    if (!nickname || nickname.startsWith('Guest-')) {
      const newNickname = prompt('Enter your nickname for the room:') || `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
      setNickname(newNickname);
    }
    createRoom();
  };
  
  const handleServerSelect = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerType(server.type);
    setActiveServerName(server.serverName);
    localStorage.setItem("server_name", server.serverName);
    localStorage.setItem("server_type", server.type);
  };

  // Filter servers based on multiplayer compatibility
  const isIframeCompatible = (server) => {
    // Multiplayer compatible servers: Only SLAY servers
    return server.type === "slay";
  };

  // When in multiplayer room, only show iframe-compatible servers
  const filteredServers = isInRoom 
    ? servers?.filter(isIframeCompatible) || []
    : servers || [];

  const subServers = filteredServers.filter((server) => server.type === "sub") || [];
  const dubServers = filteredServers.filter((server) => server.type === "dub") || [];
  const rawServers = filteredServers.filter((server) => server.type === "raw") || [];
  const multiServers = filteredServers.filter((server) => server.type === "multi") || [];
  const slayServers = filteredServers.filter((server) => server.type === "slay") || [];

  useEffect(() => {
    const savedServerName = localStorage.getItem("server_name");
    
    // When joining a room, switch to iframe-compatible server if current isn't compatible
    if (isInRoom && servers) {
      const currentServer = servers.find(s => s.data_id === activeServerId);
      if (currentServer && !isIframeCompatible(currentServer)) {
        // Switch to first available iframe-compatible server
        const compatibleServer = servers.find(isIframeCompatible);
        if (compatibleServer) {
          setActiveServerId(compatibleServer.data_id);
          setActiveServerType(compatibleServer.type);
          setActiveServerName(compatibleServer.serverName);
          localStorage.setItem("server_name", compatibleServer.serverName);
          localStorage.setItem("server_type", compatibleServer.type);
        }
      }
    } else if (savedServerName) {
      const matchingServer = servers?.find(
        (server) => server.serverName === savedServerName,
      );

      if (matchingServer) {
        setActiveServerId(matchingServer.data_id);
        setActiveServerType(matchingServer.type);
      } else if (servers && servers.length > 0) {
        setActiveServerId(servers[0].data_id);
        setActiveServerType(servers[0].type);
      }
    } else if (servers && servers.length > 0) {
      setActiveServerId(servers[0].data_id);
      setActiveServerType(servers[0].type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servers, isInRoom, activeServerId]);

  return (
    <div className="relative bg-[#111111] p-4 w-full min-h-[100px] flex justify-center items-center max-[1200px]:bg-[#151515] max-[600px]:p-2">
      {serverLoading ? (
        <div className="w-full h-full rounded-lg flex justify-center items-center max-[600px]:rounded-none">
          <BouncingLoader />
        </div>
      ) : servers ? (
        <div className="w-full h-full rounded-lg grid grid-cols-[minmax(0,30%),minmax(0,70%)] overflow-hidden max-[800px]:grid-cols-[minmax(0,40%),minmax(0,60%)] max-[600px]:flex max-[600px]:flex-col max-[600px]:rounded-none max-[600px]:gap-2">
          <div className="h-full bg-[#e0e0e0] px-6 text-black flex flex-col justify-center items-center gap-y-2 max-[600px]:bg-transparent max-[600px]:h-auto max-[600px]:text-white max-[600px]:py-1 max-[600px]:px-2 fade-in">
            <p className="text-center leading-5 font-medium text-[14px] max-[600px]:text-[13px] max-[600px]:mb-0" style={{ fontVariant: 'small-caps' }}>
              ʏᴏᴜ ᴀʀᴇ ᴡᴀᴛᴄʜɪɴɢ:{" "}
              <br className="max-[600px]:hidden" />
              <span className="font-semibold max-[600px]:text-[#e0e0e0] max-[600px]:ml-1">
                ᴇᴘɪꜱᴏᴅᴇ {activeEpisodeNum}
              </span>
            </p>
            {isInRoom ? (
              <p className="leading-5 text-[14px] font-medium text-center max-[600px]:text-[12px] text-blue-300 fade-in delay-100" style={{ fontVariant: 'small-caps' }}>
                👥 ᴍᴜʟᴛɪᴘʟᴀʏᴇʀ ᴍᴏᴅᴇ - ᴏɴʟʏ ᴄᴏᴍᴘᴀᴛɪʙʟᴇ ꜱᴇʀᴠᴇʀꜱ ꜱʜᴏᴡɴ
              </p>
            ) : (
              <>
                <p className="leading-5 text-[14px] font-medium text-center max-[600px]:text-[12px] max-[600px]:hidden fade-in delay-100" style={{ fontVariant: 'small-caps' }}>
                  ɪ̀ ᴛʜᴇ ᴄᴜʀʀᴇɴᴛ ꜱᴇʀᴠᴇʀ ᴅᴏᴇꜱɴ'ᴛ ᴡᴏʀᴋ, ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴏᴛʜᴇʀ ꜱᴇʀᴠᴇʀꜱ
                  ʙᴇꜱɪᴅᴇ.
                </p>
                <button
                  onClick={handleCreateRoom}
                  className="glass-morphism bg-gradient-to-r from-green-600/90 to-emerald-600/90 hover:from-green-500/90 hover:to-emerald-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/10 fade-in delay-200 text-[13px] max-[600px]:text-[12px]"
                  style={{ fontVariant: 'small-caps' }}
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                  <span>ᴄʀᴇᴀᴛᴇ ʀᴏᴏᴍ</span>
                </button>
              </>
            )}
          </div>
          <div className="bg-[#1f1f1f] flex flex-col max-[600px]:rounded-lg max-[600px]:p-2">
            {rawServers.length > 0 && (
              <div className={`servers px-2 flex items-center flex-wrap gap-y-1 ml-2 max-[600px]:py-1.5 max-[600px]:px-1 max-[600px]:ml-0 ${
                dubServers.length === 0 || subServers.length === 0
                  ? "h-1/2"
                  : "h-full"
              }`}>
                <div className="flex items-center gap-x-2 min-w-[65px]">
                  <FontAwesomeIcon
                    icon={faFile}
                    className="text-[#e0e0e0] text-[13px]"
                  />
                  <p className="font-bold text-[14px] max-[600px]:text-[12px]">RAW:</p>
                </div>
                <div className="flex gap-1.5 ml-2 flex-wrap max-[600px]:ml-0">
                  {rawServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item?.data_id
                          ? "bg-[#e0e0e0] text-black"
                          : "bg-[#373737] text-white"
                      } max-[700px]:px-3 max-[600px]:px-2 max-[600px]:py-1`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold max-[600px]:text-[12px]">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {subServers.length > 0 && (
              <div className={`servers px-2 flex items-center flex-wrap gap-y-1 ml-2 max-[600px]:py-1.5 max-[600px]:px-1 max-[600px]:ml-0 ${
                dubServers.length === 0 ? "h-1/2" : "h-full"
              }`}>
                <div className="flex items-center gap-x-2 min-w-[65px]">
                  <FontAwesomeIcon
                    icon={faClosedCaptioning}
                    className="text-[#e0e0e0] text-[13px]"
                  />
                  <p className="font-bold text-[14px] max-[600px]:text-[12px]">SUB:</p>
                </div>
                <div className="flex gap-1.5 ml-2 flex-wrap max-[600px]:ml-0">
                  {subServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item?.data_id
                          ? "bg-[#e0e0e0] text-black"
                          : "bg-[#373737] text-white"
                      } max-[700px]:px-3 max-[600px]:px-2 max-[600px]:py-1`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold max-[600px]:text-[12px]">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dubServers.length > 0 && (
              <div className={`servers px-2 flex items-center flex-wrap gap-y-1 ml-2 max-[600px]:py-1.5 max-[600px]:px-1 max-[600px]:ml-0 ${
                subServers.length === 0 ? "h-1/2" : "h-full"
              }`}>
                <div className="flex items-center gap-x-2 min-w-[65px]">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className="text-[#e0e0e0] text-[13px]"
                  />
                  <p className="font-bold text-[14px] max-[600px]:text-[12px]">DUB:</p>
                </div>
                <div className="flex gap-1.5 ml-2 flex-wrap max-[600px]:ml-0">
                  {dubServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item?.data_id
                          ? "bg-[#e0e0e0] text-black"
                          : "bg-[#373737] text-white"
                      } max-[700px]:px-3 max-[600px]:px-2 max-[600px]:py-1`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold max-[600px]:text-[12px]">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
             {multiServers.length > 0 && (
              <div className={`servers px-2 flex items-center flex-wrap gap-y-1 ml-2 max-[600px]:py-1.5 max-[600px]:px-1 max-[600px]:ml-0 ${
                subServers.length === 0 && dubServers.length === 0 ? "h-1/2" : "h-full"
              }`}>
                <div className="flex items-center gap-x-2 min-w-[65px]">
                  <FontAwesomeIcon
                    icon={faLanguage}
                    className="text-[#e0e0e0] text-[13px]"
                  />
                  <p className="font-bold text-[14px] max-[600px]:text-[12px]">MULTI:</p>
                </div>
                <div className="flex gap-1.5 ml-2 flex-wrap max-[600px]:ml-0">
                  {multiServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item?.data_id
                          ? "bg-[#e0e0e0] text-black"
                          : "bg-[#373737] text-white"
                      } max-[700px]:px-3 max-[600px]:px-2 max-[600px]:py-1`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold max-[600px]:text-[12px]">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {slayServers.length > 0 && (
              <div className="servers px-2 flex items-center flex-wrap gap-y-1 ml-2 max-[600px]:py-1.5 max-[600px]:px-1 max-[600px]:ml-0 h-full">
                <div className="flex items-center gap-x-2 min-w-[65px]">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className="text-[#e0e0e0] text-[13px]"
                  />
                  <p className="font-bold text-[14px] max-[600px]:text-[12px]">SLAY:</p>
                </div>
                <div className="flex gap-1.5 ml-2 flex-wrap max-[600px]:ml-0">
                  {slayServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${
                        activeServerId === item?.data_id
                          ? "bg-[#e0e0e0] text-black"
                          : "bg-[#373737] text-white"
                      } max-[700px]:px-3 max-[600px]:px-2 max-[600px]:py-1`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold max-[600px]:text-[12px]">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center font-medium text-[15px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          Could not load servers <br />
          Either reload or try again after sometime
        </p>
      )}
    </div>
  );
}

export default Servers;

