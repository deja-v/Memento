import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home.tsx";
import Login from "./pages/login.tsx";
import SignUp from "./pages/sign-up.tsx";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token")
  return isAuthenticated? <Navigate to="dashboard" />
  : <Navigate to="login" />
}

export default App;
