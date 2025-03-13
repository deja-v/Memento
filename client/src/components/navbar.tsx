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
      <img src={logo} alt="Travel Journal" className="h-12" />
      <h6 className="font-semibold">Travel Journal</h6>
      {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};

export default Navbar;
