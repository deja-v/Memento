import moment from "moment";
import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";

interface MementoCardProps {
  imgUrl: File | string | null;
  title: string;
  date?: Date;
  description?: string;
  visitedLocation?: any[];
  isFavourite?: boolean;
  onFavouriteClick?: () => void;
  onClick?: () => void;
  onEdit?: () => void;
}

const MementoCard: React.FC<MementoCardProps> = ({
  imgUrl,
  title,
  date,
  description,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    if (imgUrl instanceof File) {
      const objectUrl = URL.createObjectURL(imgUrl);
      setImageSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof imgUrl === "string") {
      setImageSrc(imgUrl);
    } else {
      setImageSrc("");
    }
  }, [imgUrl]);

  return (
    <div
      className="card-hover bg-white rounded-2xl overflow-hidden border border-slate-100 relative cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <button
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            onFavouriteClick && onFavouriteClick();
          }}
        >
          <FaHeart
            className={`text-xl transition-all duration-200 ${
              isFavourite 
                ? "text-red-500 scale-110" 
                : "text-slate-400 hover:text-red-400"
            }`}
          />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1 line-clamp-1">
              {title}
            </h3>
            <span className="text-sm text-slate-500 font-medium">
              {date && moment(date).isValid()
                ? moment(date).format("Do MMM YYYY")
                : "-"}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {description?.slice(0, 80)}
          {description && description.length > 80 && "..."}
        </p>
        
        {visitedLocation?.length > 0 && (
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-full px-3 py-2 border border-blue-100">
            <GrMapLocation className="text-blue-500" />
            <span className="font-medium">
              {visitedLocation.map((item, index) =>
                visitedLocation.length === index + 1 ? `${item}` : `${item}, `
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MementoCard;
