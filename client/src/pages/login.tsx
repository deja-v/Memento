import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/input/password-input.js";
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
      console.log(response.data);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-30"></div>

      <div className="container min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 lg:px-20 mx-auto relative z-10">
        {/* Hero Section - Hidden on mobile, visible on larger screens */}
        <div className="hidden lg:flex w-full lg:w-2/4 h-[90vh] items-center bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-10 border border-white/20 shadow-2xl">
          <div className="max-w-md">
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
              Preserve Your <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Memories
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed pr-4">
              Save every moment—from exciting journeys to everyday wonders—with
              Memento. Your personal digital time capsule.
            </p>
          </div>
        </div>

        {/* Mobile Hero Section */}
        <div className="lg:hidden w-full text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 leading-tight mb-4">
            Preserve Your <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Memories
            </span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed px-4">
            Save every moment—from exciting journeys to everyday wonders—with
            Memento.
          </p>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-2/4 h-auto lg:h-[75vh] glass-effect rounded-2xl p-6 lg:p-16 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-600">Sign in to continue your journey</p>
            </div>
            
            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" className="btn-primary text-lg font-semibold">
              Sign In
            </button>
            
            <div className="text-center">
              <p className="text-slate-500 mb-4">Don't have an account?</p>
              <button
                type="button"
                className="btn-secondary text-lg font-semibold"
                onClick={() => navigate("/signUp")}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
