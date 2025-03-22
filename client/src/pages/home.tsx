import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import axiosInstance from "../utils/axiosinstance";
import axios from "axios";
import TravelJournalCard from "../components/cards/travel-journal";
import { MdAdd } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelJournal from "../components/add-edit-travel-journal";
import ViewTravelJournal from "../components/view-travel-journal";
import EmptyCard from "../components/cards/empty-card";
import Logo from "../assets/logo.png";
import { DayPicker } from "react-day-picker";
import { DateRange } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../components/cards/filter-info-title";
export interface Journal {
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
  const [allJournals, setAllJournals] = useState<Journal[]>([]);

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

  const getEmptyCardMessage = (filterType: string) => {
    if (filterType === "search") {
      return "Oops! No journals found matching your search.";
    } else if (filterType === "date") {
      return "No journals found in the given date range";
    } else {
      return "Create your Journal by clicking the 'Add' button to write down your thoughts, ideas and memories. Let's get started!";
    }
  };
  const getUserInfo = async () => {
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

  const getAllTravelJournals = async () => {
    try {
      const response = await axiosInstance.get("/travel-journal/all");
      if (response.data && response.data.result) {
        setAllJournals(response.data.result);
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

  const handleEdit = (data: any) => {
    setOpenAddEditModal({ isOpen: true, type: "edit", data: data });
  };

  const handleViewJournal = (data: any) => {
    setOpenViewModal({ isOpen: true, data });
  };

  const updateIsFavourite = async (journalData: any) => {
    const journalId = journalData._id;
    try {
      const response = await axiosInstance.put(
        `/travel-journal/update-favourite/${journalId}`,
        {
          isFavourite: !journalData.isFavourite,
        }
      );
      if (response.data && response.data.journal) {
        if (journalData.isFavourite) toast.success("Removed from favourites");
        else toast.success("Added to favourites");

        if (filterType === "search" && searchQuery) {
          onSearchJournal(searchQuery);
        } else if (filterType === "date") {
          filterJournalsByDate(dateRange!);
        } else {
          getAllTravelJournals();
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

  const deleteTravelJournal = async (data: Journal | null) => {
    const journalId = data?._id;

    try {
      const response = await axiosInstance.delete(
        `/travel-journal/delete/${journalId}`
      );
      if (response.data && !response.data.error) {
        toast.success("Journal Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isOpen: false }));
        getAllTravelJournals();
      }
    } catch (error: any) {
      console.log("An error occured ", error);
    }
  };

  const onSearchJournal = async (query: string) => {
    try {
      const response = await axiosInstance.get(`/travel-journal/search/`, {
        params: {
          query,
        },
      });

      if (response.data && response.data.journals) {
        setFilterType("search");
        setAllJournals(response.data.journals);
      }
    } catch (error: any) {
      console.log("An error occured ", error);
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelJournals();
  };

  const filterJournalsByDate = async (day: DateRange) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;
      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-journal/filter", {
          params: { startDate, endDate },
        });
        if (response.data && response.data.journals) {
          setFilterType("date");
          setAllJournals(response.data.journals);
        }
      }
    } catch (error: any) {
      console.log("An error occured ", error);
    }
  };

  const handleDayClick = (day: DateRange) => {
    setDateRange(day);
    filterJournalsByDate(day);
  };

  const resetFilter = () => {
    setDateRange(undefined);
    setFilterType("");
    getAllTravelJournals();
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelJournals();
  }, []);

  return (
    <>
      <div>
        <Navbar
          userInfo={userInfo}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchNote={onSearchJournal}
          handleClearSearch={handleClearSearch}
        />

        <div className="w-full p-10">
          <FilterInfoTitle
            filterType={filterType}
            filterDates={dateRange}
            onClear={() => {
              resetFilter();
            }}
          />

          <div className="flex gap-7">
            <div className="flex-1">
              {allJournals.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {allJournals.map((item) => (
                    <TravelJournalCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      journal={item.description}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewJournal(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyCard
                  imgSrc={Logo}
                  message={getEmptyCardMessage(filterType)}
                />
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
                    onSelect={handleDayClick}
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
          overlay: {
            backgroundColor: "rgba(0,0,0,0,2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root") as HTMLElement}
        className="model-box"
      >
        <AddEditTravelJournal
          type={openAddEditModal.type}
          journalInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isOpen: false, type: "add", data: null });
          }}
          getAllTravelJournals={getAllTravelJournals}
        />
      </Modal>

      <Modal
        isOpen={openViewModal.isOpen}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0,2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root") as HTMLElement}
        className="model-box"
      >
        <ViewTravelJournal
          journalInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isOpen: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isOpen: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelJournal(openViewModal.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full btn-primary fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isOpen: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
