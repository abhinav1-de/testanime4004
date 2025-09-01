import { useState } from 'react';
import { useMultiplayer } from '@/src/context/MultiplayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function JoinRoomPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const { joinRoom, roomError, isInRoom } = useMultiplayer();

  const handleJoinRoom = () => {
    if (roomCode.trim() && username.trim()) {
      joinRoom(roomCode.trim(), username.trim());
      setShowPanel(false);
    }
  };

  if (isInRoom) return null;

  return (
    <>
      {/* Join Room Button */}
      <div className="fixed bottom-4 left-4 z-40 fade-in delay-1000">
        <button
          onClick={() => setShowPanel(true)}
          className="glass-morphism bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-500/90 hover:to-purple-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/10"
          data-testid="button-join-room-home"
          style={{ fontVariant: 'small-caps' }}
        >
          <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
          <span className="text-sm font-medium">ᴊᴏɪɴ ʀᴏᴏᴍ</span>
        </button>
      </div>

      {/* Join Room Modal */}
      {showPanel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 fade-in">
          <div className="glass-morphism bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/20 rounded-xl p-6 w-80 max-w-[90vw] shadow-2xl fade-in-scale">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold" style={{ fontVariant: 'small-caps' }}>ᴊᴏɪɴ ʀᴏᴏᴍ</h3>
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 glass-hover p-2 rounded-lg"
                data-testid="button-close-join-panel"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="fade-in delay-100">
                <label className="block text-gray-300 text-sm mb-2" style={{ fontVariant: 'small-caps' }}>ʏᴏᴜʀ ᴜꜱᴇʀɴᴀᴍᴇ</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 glass bg-gray-800/50 text-white rounded-lg border border-gray-600/50 focus:border-blue-500/80 focus:outline-none transition-all duration-200 backdrop-blur-sm"
                  placeholder="ᴇɴᴛᴇʀ ʏᴏᴜʀ ᴜꜱᴇʀɴᴀᴍᴇ"
                  style={{ fontVariant: 'small-caps' }}
                  data-testid="input-username-join"
                />
              </div>

              <div className="fade-in delay-200">
                <label className="block text-gray-300 text-sm mb-2" style={{ fontVariant: 'small-caps' }}>ʀᴏᴏᴍ ᴄᴏᴅᴇ</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full px-3 py-2 glass bg-gray-800/50 text-white rounded-lg border border-gray-600/50 focus:border-blue-500/80 focus:outline-none transition-all duration-200 backdrop-blur-sm"
                  placeholder="ᴇɴᴛᴇʀ ʀᴏᴏᴍ ᴄᴏᴅᴇ"
                  style={{ fontVariant: 'small-caps' }}
                  data-testid="input-room-code-join"
                />
              </div>

              <button
                onClick={handleJoinRoom}
                disabled={!roomCode.trim() || !username.trim()}
                className="w-full glass-morphism bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-500/90 hover:to-purple-500/90 disabled:from-gray-600/50 disabled:to-gray-600/50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/10 fade-in delay-300 flex items-center justify-center gap-2"
                style={{ fontVariant: 'small-caps' }}
                data-testid="button-submit-join-room"
              >
                <span>ᴊᴏɪɴ ʀᴏᴏᴍ</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
              </button>

              {roomError && (
                <div className="text-red-400 text-sm text-center fade-in" style={{ fontVariant: 'small-caps' }} data-testid="text-join-error">
                  {roomError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
