import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "./input/date-selector";
import { useState } from "react";
import ImageSelector from "./input/image-selector";
import TagInput from "./input/tag-input";
import axiosInstance from "../utils/axiosinstance";
import moment from "moment";
import uploadImage from "../utils/uploadImage";
import { toast } from "react-toastify";

interface AddEditMementoProps {
  mementoInfo: any;
  type: string;
  onClose: () => void;
  getAllMementos: () => void;
}

const AddEditMemento: React.FC<AddEditMementoProps> = ({
  mementoInfo,
  type,
  onClose,
  getAllMementos,
}) => {
  const [visitedDate, setVisitedDate] = useState<Date | null>(
    mementoInfo?.visitedDate || null
  );
  const [title, setTitle] = useState(mementoInfo?.title || "");
  const [memento, setMemento] = useState(mementoInfo?.description || "");
  const [mementoImg, setMementoImg] = useState<File | string | null>(
    mementoInfo?.imageUrl || null
  );
  const [visitedLocation, setVisitedLocation] = useState<any[]>(
    mementoInfo?.visitedLocation || []
  );
  const [publicId] = useState<string | null>(
    mementoInfo?.public_id || null
  );
  const [error, setError] = useState<string>("");

  const addNewMemento = async () => {
    try {
      let imageUrl = "";

      if (mementoImg) {
        const imgUploadRes = await uploadImage(mementoImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/memento/add", {
        title,
        description: memento,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });
      if (response.data && response.data.result) {
        toast.success("Memento Added Successfully");
        getAllMementos();
        onClose();
      }
    } catch (error: any) {
      console.error(
        "Error adding memento:",
        error.response?.data || error.message
      );
      toast.error(
        "Failed to add memento. Please check the input and try again."
      );
    }
  };

  const updateMemento = async () => {
    const mementoId = mementoInfo._id;
    try {
      let imageUrl = "";
      let updatedPublicId = publicId;

      // If a new file is selected, re-upload and update both values
      if (mementoImg && mementoImg instanceof File) {
        const imgUploadRes = await uploadImage(mementoImg);
        imageUrl = imgUploadRes.imageUrl || imageUrl;
        updatedPublicId = imgUploadRes.public_id || updatedPublicId;
      }
      
      const response = await axiosInstance.put(
        `/memento/edit/${mementoId}`,
        {
          title,
          description: memento,
          imageUrl: imageUrl || mementoInfo.imageUrl,
          visitedLocation,
          visitedDate: visitedDate
            ? moment(visitedDate).valueOf()
            : moment().valueOf(),
        }
      );
      if (response.data && response.data.result) {
        toast.success("Memento Updated Successfully");
        getAllMementos();
        onClose();
      }
    } catch (error: any) {
      console.error(
        "Error updating memento:",
        error.response?.data || error.message
      );
      toast.error(
        "Failed to update memento. Please check the input and try again."
      );
      onClose();
    }
  };

  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!memento) {
      setError("Please enter the memento description");
      return;
    }

    setError("");
    if (type === "edit") {
      updateMemento();
    } else {
      addNewMemento();
    }
  };

  const handleDeleteMementoImg = async () => {
    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: { public_id: publicId },
    });
    if (deleteImgRes.data) {
      const mementoId = mementoInfo._id;
      const postData = {
        title,
        description: memento,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
        public_id: null,
      };
      await axiosInstance.put(`/edit/${mementoId}`, postData);
      setMementoImg(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Memento" : "Update Memento"}
        </h5>
        <div>
          <div className="flex items-center gap-3 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" /> ADD MEMENTO
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdUpdate className="text-lg" /> UPDATE MEMENTO
                </button>
                <button className="btn-small btn-delete" onClick={onClose}>
                  <MdDeleteOutline className="text-lg" /> DELETE
                </button>
              </>
            )}
            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400 cursor-pointer" />
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="Give a great title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            image={mementoImg}
            setImage={setMementoImg}
            handleDeleteImg={handleDeleteMementoImg}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">DESCRIPTION</label>
            <textarea
              className="text-sm text-slate-950 p-2 rounded outline-none bg-slate-50"
              placeholder="Write your memento here"
              rows={8}
              value={memento}
              onChange={(e) => setMemento(e.target.value)}
            />
          </div>

          <div className="pt-3">
            <label className="input-label">VISITED LOCATION</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditMemento;
