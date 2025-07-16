import logo from "../assets/logo.png";
import ProfileInfo from "./cards/profile-info";
import { useNavigate } from "react-router-dom";
import SearchBar from "./input/search-bar";

interface NavbarProps {
  userInfo: any;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearchNote: (query: string) => void;
  handleClearSearch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) => {
  const navigate = useNavigate();
  const isToken = localStorage.getItem("token");

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <div className="glass-effect flex items-center justify-between px-8 py-4 sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={logo} alt="Memento" className="h-12 w-12 object-contain" />
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-sm"></div>
        </div>
        <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Mementos
        </h1>
      </div>
      {isToken && (
        <div className="flex items-center gap-6">
          <SearchBar
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(e.target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
