import moment from "moment";
import {useState, useEffect} from "react";
import { FaHeart } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
interface TravelJournalCardProps {
  imgUrl: File | string | null;
  title: string;
  date?: Date;
  journal?: string;
  visitedLocation?: any[];
  isFavourite?: boolean;
  onFavouriteClick?: () => void;
  onClick?: () => void;
  onEdit?: ()=>void;
}

const TravelJournalCard: React.FC<TravelJournalCardProps> = ({
  imgUrl,
  title,
  date,
  journal,
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
      className="border-[1px] rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer"
      onClick={onClick}
    >
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-56 object-contain rounded-lg"
      />
      <button
        className="w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4"
        onClick={onFavouriteClick}
      >
        <FaHeart
          className={`icon-btn ${isFavourite ? "text-red-500": "text-stone-200 hover:text-red-500"}`}
        />
      </button>
      <div className="p-4" onClick={onClick}>
        <div className="flex items-center gap-3 p-2">
          <div className="flex-1">
            <h6 className="text-sm font-medium">{title}</h6>
            <span className="text-xs text-slate-500">
              {date && moment(date).isValid()
                ? moment(date).format("Do MMM YYYY")
                : "-"}
            </span>
          </div>
        </div>

        <p className="text=xs text-slate-600 mt-2">{journal?.slice(0,60)}</p>
        <div className="inline-flex items-center gap-2 text-[13px] text-blue-400 bg-blue-200/40 rounded mt-3 px-2 py-1">
            <GrMapLocation className="text-sm"/>
            {visitedLocation?.length && visitedLocation.map((item,index)=>
              visitedLocation.length == index+1 ? `${item}`: `${item}, `
            )}
        </div>
      </div>
    </div>
  );
};

export default TravelJournalCard;
