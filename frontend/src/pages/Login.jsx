import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const roleToPath = {
  admin: "/admin",
  security: "/security",
  host: "/host",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      navigate(roleToPath[data.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h1 className="text-xl font-semibold mb-6">VMS Login</h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
