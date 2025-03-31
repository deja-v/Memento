import React from "react";
import { MdClose, MdEdit, MdDelete } from "react-icons/md";

interface ViewMementoProps {
  mementoInfo: any;
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
    <div className="p-4">
      <div className="flex justify-end">
        <button onClick={onClose}>
          <MdClose className="text-2xl text-gray-500" />
        </button>
      </div>
      <div>
        <h2 className="text-2xl font-bold">{mementoInfo.title}</h2>
        {mementoInfo.imageUrl && (
          <img
            src={
              typeof mementoInfo.imageUrl === "string"
                ? mementoInfo.imageUrl
                : ""
            }
            alt="Memento"
            className="w-full h-auto mt-4"
          />
        )}
        <p className="mt-4">{mementoInfo.description}</p>
        <p className="mt-2 text-sm text-gray-600">
          Visited on: {new Date(mementoInfo.visitedDate).toLocaleDateString()}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Location: {mementoInfo.visitedLocation?.join(", ")}
        </p>
      </div>
      <div className="mt-4 flex gap-4">
        <button className="btn-primary" onClick={onEditClick}>
          <MdEdit className="mr-2" /> Edit Memento
        </button>
        <button className="btn-danger" onClick={onDeleteClick}>
          <MdDelete className="mr-2" /> Delete Memento
        </button>
      </div>
    </div>
  );
};

export default ViewMemento;
