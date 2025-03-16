import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "./input/date-selector";
import { useState } from "react";
import ImageSelector from "./input/image-selector";
import TagInput from "./input/tag-input";
import axiosInstance from "../utils/axiosinstance";
import moment from "moment";
import uploadImage from "../utils/uploadImage";
import { toast } from "react-toastify";
interface AddEditTravelJournalProps {
  journalInfo: any;
  type: string;
  onClose: () => void;
  getAllTravelJournals: () => void;
}

const AddEditTravelJournal: React.FC<AddEditTravelJournalProps> = ({
  journalInfo,
  type,
  onClose,
  getAllTravelJournals,
}) => {
  const [visitedDate, setVisitedDate] = useState<Date | null>(journalInfo?.visitedDate || null);
  const [title, setTitle] = useState(journalInfo?.title || "");
  const [journal, setJournal] = useState(journalInfo?.description || "");
  const [journalImg, setJournalImg] = useState<File | string | null>(journalInfo?.imageUrl || null);
  const [visitedLocation, setVisitedLocation] = useState<any[]>(journalInfo?.visitedLocation || []);
  const [error, setError] = useState<string>("");

  const addNewTravelJournal = async () => {
    try {
      let imageUrl = "";

      if (journalImg) {
        const imgUploadRes = await uploadImage(journalImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/travel-journal/add", {
        title,
        description:journal,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });
      if (response.data && response.data.result) {
        toast.success("Journal Added Successfully");
        getAllTravelJournals();
        onClose();
      }
    } catch (error: any) {
      console.error(
        "Error adding journal:",
        error.response?.data || error.message
      );
      toast.error(
        "Failed to add journal. Please check the input and try again."
      );
    }
  };

  const updateTravelJournal = async () => {
    const journalId = journalInfo._id;
    try {
      let imageUrl = "";

      if(typeof journalImg === "object"){
        const imgUploadRes = await uploadImage(journalImg);
        imageUrl = imgUploadRes.imageUrl || "";

      }

      const response = await axiosInstance.put(`/travel-journal/edit/${journalId}`, {
        title,
        description:journal,
        imageUrl: imageUrl || journalInfo.imageUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });
      if (response.data && response.data.result) {
        toast.success("Journal Updated Successfully");
        getAllTravelJournals();
        onClose();
      }
    } catch (error: any) {
      console.error(
        "Error updating journal:",
        error.response?.data || error.message
      );
      toast.error(
        "Failed to update journal. Please check the input and try again."
      );
      onClose()
    }
  };
  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!journal) {
      setError("Please enter the journal");
    }

    setError("");
    if (type === "edit") {
      updateTravelJournal();
    } else {
      addNewTravelJournal();
    }
  };

  const handleDeleteJournalImg = async () => {
    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: {
        imageUrl: journalInfo.imageUrl,
      },
    })
    console.log(deleteImgRes)
    if(deleteImgRes.data) {
      const journalId = journalInfo._id;
      const postData = {
        title,
        description:journal,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      }
      const response = await axiosInstance.put(`/edit/${journalId}`, postData);
      setJournalImg(null);
    }

  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Journal" : "Update Journal"}
        </h5>
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" /> ADD JOURNAL
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdUpdate className="text-lg" /> UPDATE JOURNAL
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
            image={journalImg}
            setImage={setJournalImg}
            handleDeleteImg={handleDeleteJournalImg}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">JOURNAL</label>
            <textarea
              className="text-sm text-slate-950 p-2 rounded outline-none bg-slate-50"
              placeholder="Write your journal here"
              rows={8}
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
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

export default AddEditTravelJournal;
