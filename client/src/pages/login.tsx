import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/input/PasswordInput";
import { validateEmail } from "../utils/helper.js";
import axiosInstance from "../utils/axiosinstance.js";
import { isAxiosError } from "axios";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/user/login", {
        email: email,
        password: password,
      });
      console.log(response.data)
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const data = error.response.data as { msg?: string };
        setError(data.msg || "An unexpected error occurred. Please try again");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40"></div>
      <div className="login-ui-box bg-cyan-100 -bottom-40 right-3/4"></div>

      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[90vh] flex items-center bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl text-zinc-800 font-semibold leading-[58px]">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-[15px] text-zinc-500 leading-6 pr-7 mt-4">
              Record your travel experiences and memories in your personal
              Travel Journal.
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              LOGIN
            </button>
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/signUp")}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
