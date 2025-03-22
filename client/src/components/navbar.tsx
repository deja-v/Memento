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
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <div className="flex items-center gap-1">
        <img src={logo} alt="Travel Journal" className="h-12" />
        <h6
          style={{ fontFamily: '"Akaya Kanadaka", system-ui' }}
          className="font-semibold text-zinc-500"
        >
          Travel Journal
        </h6>
      </div>
      {isToken && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(e.target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

export default Navbar;
