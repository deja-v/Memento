import logo from "../assets/logo.png";
import ProfileInfo from "./cards/profile-info";
import { useNavigate } from "react-router-dom";
interface NavbarProps {
  userInfo: any;
}

const Navbar: React.FC<NavbarProps> = ({ userInfo }) => {
  const navigate = useNavigate();
  const isToken = localStorage.getItem("token");

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <div className="flex items-center gap-1">
        <img src={logo} alt="Travel Journal" className="h-12" />
        <h6 style={{ fontFamily: '"Akaya Kanadaka", system-ui' }} className="font-semibold text-zinc-500">Travel Journal</h6>
      </div>
      {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};

export default Navbar;
