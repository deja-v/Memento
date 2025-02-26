import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import Login from "./pages/login.tsx";
import SignUp from "./pages/sign-up.tsx";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
