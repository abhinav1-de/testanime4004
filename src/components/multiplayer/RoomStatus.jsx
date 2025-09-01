import { useMultiplayer } from '@/src/context/MultiplayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function RoomStatus() {
  const { isInRoom, roomCode, isHost, members, isConnected } = useMultiplayer();

  if (!isInRoom) return null;

  return (
    <div className={`${isConnected ? 'bg-green-600/20 border-green-600/50' : 'bg-yellow-600/20 border-yellow-600/50'} glass-morphism border rounded-xl p-3 mb-4 backdrop-blur-md shadow-lg fade-in`} style={{ fontVariant: 'small-caps' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 fade-in delay-100">
          <FontAwesomeIcon icon={faUsers} className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-yellow-400'}`} />
          <div>
            <p className="text-white text-sm font-medium">
              ᴡᴀᴛᴄʜɪɴɢ ᴛᴏɢᴇᴛʜᴇʀ ɪɴ ʀᴏᴏᴍ {roomCode}
              {!isConnected && <span className="text-yellow-400 ml-2">(ʀᴇᴄᴏɴɴᴇᴄᴛɪɴɢ...)</span>}
            </p>
            <p className="text-gray-300 text-xs">
              {members.length} {members.length === 1 ? 'ᴘᴇʀꜱᴏɴ' : 'ᴘᴇᴏᴘʟᴇ'} ᴡᴀᴛᴄʜɪɴɢ
            </p>
          </div>
        </div>
        {isHost && (
          <div className="flex items-center gap-1 text-yellow-400 fade-in delay-200">
            <FontAwesomeIcon icon={faCrown} className="w-3 h-3" />
            <span className="text-xs font-medium">ʜᴏꜱᴛ</span>
          </div>
        )}
      </div>
    </div>
  );
}
