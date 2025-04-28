import React from "react";
import { MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import moment from "moment";
import { GrMapLocation } from "react-icons/gr";
import { Memento } from "../pages/home";

interface ViewMementoProps {
  mementoInfo: Memento | null;
  onClose: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const ViewMemento: React.FC<ViewMementoProps> = ({
  mementoInfo,
  onClose,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-end">
        <div>
          <div className="flex items-center gap-3 p-2 rounded-l-lg">
            <button className="btn-small" onClick={onEditClick}>
              <MdUpdate className="text-lg" /> UPDATE MEMENTO
            </button>

            <button className="btn-small btn-delete" onClick={onDeleteClick}>
              <MdDeleteOutline className="text-lg" /> Delete
            </button>

            <button className="cursor-pointer" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 py-4">
          <h1 className="text-2xl text-slate-950">{mementoInfo?.title}</h1>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {mementoInfo && moment(mementoInfo.visitedDate).format("Do MMM YYYY")}
            </span>
            <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
              <GrMapLocation className="text-sm" />
              {mementoInfo &&
                mementoInfo.visitedLocation.map((item, index) =>
                  mementoInfo.visitedLocation.length === index + 1
                    ? `${item}`
                    : `${item}, `
                )}
            </div>
          </div>
        </div>

        {mementoInfo?.imageUrl && typeof mementoInfo.imageUrl === "string" && (
          <img
            src={mementoInfo.imageUrl}
            alt="Selected"
            className="w-full h-[300px] object-cover rounded-lg"
          />
        )}

        <div className="mt-4">
          <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
            {mementoInfo?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewMemento;