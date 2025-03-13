import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "./input/date-selector";
import { useState } from "react";
import ImageSelector from "./input/image-selector";
import TagInput from "./input/tag-input";
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
  const [visitedDate, setVisitedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [journal, setJournal] = useState("");
  // Explicitly type journalImg as File | string | null
  const [journalImg, setJournalImg] = useState<File | string | null>(null);
  const [visitedLocation, setVisitedLocation] = useState<any[]>([]);

  const handleAddOrUpdateClick = () => {};

  const handleDeleteJournalImg = async () => {

  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Journal" : "Update Journal"}
        </h5>
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={() => {}}>
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
