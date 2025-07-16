import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  onClearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({value, onChange, handleSearch, onClearSearch}) => {
  return (
    <div className="relative w-80">
      <div className="flex items-center px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-blue-400 focus-within:shadow-lg focus-within:shadow-blue-100">
        <FaMagnifyingGlass 
          className="text-slate-400 mr-3 text-lg"
        />
        <input
          type="text"
          placeholder="Search your memories..."
          className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
          value={value}
          onChange={onChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        {value && (
          <button
            onClick={onClearSearch}
            className="ml-2 p-1 rounded-full hover:bg-slate-100 transition-colors duration-200"
          >
            <IoMdClose
              className="text-lg text-slate-500 hover:text-slate-700"
            />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
