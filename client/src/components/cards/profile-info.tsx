import { getInitials } from "../../utils/helper"

interface ProfileInfoProps {
    userInfo: any;
    onLogout: ()=>void;
}


const ProfileInfo:React.FC<ProfileInfoProps> = ({userInfo,onLogout}) => {
  return (
   userInfo && ( <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
            {getInitials(userInfo? userInfo.name : "")}
        </div>
        <div className="flex items-center justify-center flex-col">
        <p className="text-sm font-medium">{userInfo? userInfo.name: ""}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
            Logout
        </button>
        </div>
    </div>)
  )
}

export default ProfileInfo