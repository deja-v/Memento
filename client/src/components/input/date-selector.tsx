import { DayPicker } from "react-day-picker";
import { useState, Dispatch, SetStateAction } from "react";
import { MdOutlineDateRange, MdClose } from "react-icons/md";
import moment from "moment";

interface DateSelectorProps {
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
}

const DateSelector = ({ date, setDate }: DateSelectorProps) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleSelect = (selectedDate: Date | undefined): void => {
    setDate(selectedDate ?? null);
  };

  return (
    <div>
      <button
        className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer"
        onClick={() => setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className="text-lg" />
        {date ? moment(date).format("Do MMM YYYY") : moment().format("Do MMM YYYY")}
      </button>

      {openDatePicker && (
        <div className="overlfow-y-scroll p-5 bg-sky-50/50 rounded-lg relative pt-9">
          <button
            className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center bg-sky-100 hover:bg-sky-100 absolute top-2 right-2"
            onClick={() => setOpenDatePicker(false)}
          >
            <MdClose className="text-xl text-sky-400" />
          </button>
          <DayPicker
            captionLayout="dropdown"
            mode="single"
            selected={date ?? undefined}
            onSelect={handleSelect}
            pagedNavigation
            required={false}
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;
