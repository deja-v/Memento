import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import axiosInstance from "../utils/axiosinstance";
import axios from "axios";
import MementoCard from "../components/cards/memento";
import { MdAdd } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import AddEditMemento from "../components/add-edit-memento";
import ViewMemento from "../components/view-memento";
import EmptyCard from "../components/cards/empty-card";
import Logo from "../assets/logo.png";
import { DayPicker } from "react-day-picker";
import { DateRange } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../components/cards/filter-info-title";

export interface Memento {
  _id: string;
  title: string;
  description: string;
  visitedLocation: any[];
  isFavourite: boolean;
  userId: string;
  createdOn: string;
  imageUrl: File | string | null;
  visitedDate: Date;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allMementos, setAllMementos] = useState<Memento[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isOpen: false,
    type: "add",
    data: null,
  });
  const [openViewModal, setOpenViewModal] = useState({
    isOpen: false,
    data: null,
  });

  const getEmptyCardMessage = (type: string) => {
    if (type === "search") {
      return "Oops! No mementos found matching your search.";
    } else if (type === "date") {
      return "No mementos found in the given date range";
    } else {
      return "Create your Memento by clicking the 'Add' button to write down your thoughts, ideas and memories. Let's get started!";
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/travel-journal/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("An unexpected error occurred:", error);
        navigate("/login");
      }
    }
  };

  const fetchAllMementos = async () => {
    try {
      const response = await axiosInstance.get("/travel-journal/all");
      if (response.data && response.data.result) {
        setAllMementos(response.data.result);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const handleEditMemento = (data: any) => {
    setOpenAddEditModal({ isOpen: true, type: "edit", data });
  };

  const handleViewMemento = (data: any) => {
    setOpenViewModal({ isOpen: true, data });
  };

  const toggleFavouriteMemento = async (mementoData: any) => {
    const mementoId = mementoData._id;
    try {
      const response = await axiosInstance.put(
        `/travel-journal/update-favourite/${mementoId}`,
        { isFavourite: !mementoData.isFavourite }
      );
      if (response.data && response.data.journal) {
        if (mementoData.isFavourite) toast.success("Removed from favourites");
        else toast.success("Added to favourites");

        if (filterType === "search" && searchQuery) {
          searchMemento(searchQuery);
        } else if (filterType === "date") {
          filterMementosByDate(dateRange!);
        } else {
          fetchAllMementos();
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const deleteMemento = async (data: Memento | null) => {
    const mementoId = data?._id;
    try {
      const response = await axiosInstance.delete(
        `/travel-journal/delete/${mementoId}`
      );
      if (response.data && !response.data.error) {
        toast.success("Memento Deleted Successfully");
        setOpenViewModal((prev) => ({ ...prev, isOpen: false }));
        fetchAllMementos();
      }
    } catch (error: any) {
      console.log("An error occurred ", error);
    }
  };

  const searchMemento = async (query: string) => {
    try {
      const response = await axiosInstance.get("/travel-journal/search/", {
        params: { query },
      });
      if (response.data && response.data.journals) {
        setFilterType("search");
        setAllMementos(response.data.journals);
      }
    } catch (error: any) {
      console.log("An error occurred ", error);
    }
  };

  const clearSearch = () => {
    setFilterType("");
    fetchAllMementos();
  };

  const filterMementosByDate = async (range: DateRange) => {
    try {
      const startDate = range.from ? moment(range.from).valueOf() : null;
      const endDate = range.to ? moment(range.to).valueOf() : null;
      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-journal/filter", {
          params: { startDate, endDate },
        });
        if (response.data && response.data.journals) {
          setFilterType("date");
          setAllMementos(response.data.journals);
        }
      }
    } catch (error: any) {
      console.log("An error occurred ", error);
    }
  };

  const onDaySelect = (range: DateRange) => {
    setDateRange(range);
    filterMementosByDate(range);
  };

  const resetFilter = () => {
    setDateRange(undefined);
    setFilterType("");
    fetchAllMementos();
  };

  useEffect(() => {
    fetchUserInfo();
    fetchAllMementos();
  }, []);

  return (
    <>
      <div>
        <Navbar
          userInfo={userInfo}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchNote={searchMemento}
          handleClearSearch={clearSearch}
        />

        <div className="w-full p-10">
          <FilterInfoTitle
            filterType={filterType}
            filterDates={dateRange}
            onClear={resetFilter}
          />

          <div className="flex gap-7">
            <div className="flex-1">
              {allMementos.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {allMementos.map((item) => (
                    <MementoCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      description={item.description}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEditMemento(item)}
                      onClick={() => handleViewMemento(item)}
                      onFavouriteClick={() => toggleFavouriteMemento(item)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyCard imgSrc={Logo} message={getEmptyCardMessage(filterType)} />
              )}
            </div>
            <div className="w-[320px]">
              <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
                <div className="p-3">
                  <DayPicker
                    captionLayout="dropdown"
                    mode="range"
                    required
                    selected={dateRange}
                    onSelect={onDaySelect}
                    pagedNavigation
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openAddEditModal.isOpen}
        onRequestClose={() => {}}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0,2)", zIndex: 999 },
        }}
        appElement={document.getElementById("root") as HTMLElement}
        className="model-box"
      >
        <AddEditMemento
          type={openAddEditModal.type}
          mementoInfo={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isOpen: false, type: "add", data: null })
          }
          getAllMementos={fetchAllMementos}
        />
      </Modal>

      <Modal
        isOpen={openViewModal.isOpen}
        onRequestClose={() => {}}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0,2)", zIndex: 999 },
        }}
        appElement={document.getElementById("root") as HTMLElement}
        className="model-box"
      >
        <ViewMemento
          mementoInfo={openViewModal.data || null}
          onClose={() =>
            setOpenViewModal((prev) => ({ ...prev, isOpen: false }))
          }
          onEditClick={() => {
            setOpenViewModal((prev) => ({ ...prev, isOpen: false }));
            handleEditMemento(openViewModal.data || null);
          }}
          onDeleteClick={() => deleteMemento(openViewModal.data || null)}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full btn-primary fixed right-10 bottom-10"
        onClick={() =>
          setOpenAddEditModal({ isOpen: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
