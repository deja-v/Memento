import { getInitials } from "../../utils/helper";
import { IoLogOutOutline } from "react-icons/io5";

interface ProfileInfoProps {
  userInfo: any;
  onLogout: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userInfo, onLogout }) => {
  return (
    userInfo && (
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
            {getInitials(userInfo ? userInfo.name : "")}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-slate-800">{userInfo ? userInfo.name : ""}</p>
          <button
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200"
            onClick={onLogout}
          >
            <IoLogOutOutline className="text-sm" />
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfo;
