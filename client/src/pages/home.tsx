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
export interface Journal {
  _id: string;
  title: string;
  description: string;
  visitedLocation: string[];
  isFavourite: boolean;
  userId: string;
  createdOn: string;
  imageUrl: string;
  visitedDate: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allJournals, setAllJournals] = useState<Journal[]>([]);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isOpen: false,
    type: 'add',
    data: null,
  });

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

  const handleEdit = (data: Journal) => {
    // Implement your edit functionality here
  };

  const handleViewJournal = (data: Journal) => {
    // Implement your view journal functionality here
  };

  const updateIsFavourite = async (journalData: Journal) => {
    // Implement your update favourite functionality here
    const journalId = journalData._id;
    try {
      const response = await axiosInstance.put(
        `/travel-journal/update-favourite/${journalId}`,
        {
          isFavourite: !journalData.isFavourite,
        }
      );
      if (response.data && response.data.journal) {
        if(journalData.isFavourite)
          toast.success("Removed from favourites");
        else
          toast.success("Added to favourites");
        getAllTravelJournals();
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

  useEffect(() => {
    getUserInfo();
    getAllTravelJournals();
  }, []);

  return (
    <>
      <div>
        <Navbar userInfo={userInfo} />

        <div className="w-full p-10">
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
                <></>
              )}
            </div>
            <div className="w-[320px]"></div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openAddEditModal.isOpen}
        onRequestClose={()=>{}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0,2)",
            zIndex: 999,
          }
        }}
        appElement={document.getElementById("root") as HTMLElement}
        className="model-box"
      >
        <AddEditTravelJournal
          type={openAddEditModal.type}
          journalInfo={openAddEditModal.data}
          onClose={()=>{
            setOpenAddEditModal({isOpen:false,type: "add", data:null});
          }}
          getAllTravelJournals={getAllTravelJournals}
        />
      </Modal>
      <button
      className="w-16 h-16 flex items-center justify-center rounded-full btn-primary fixed right-10 bottom-10"
      onClick={()=>{
        setOpenAddEditModal({isOpen: true, type: 'add', data: null}); 
      }}
      >
        <MdAdd className="text-[32px] text-white"/>
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
