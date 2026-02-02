import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../utils/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   

    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.role) {
      toast.error("All fields required");
      setLoading(false);
      return;
    }

    if( !form.email.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/) ) {
      toast.error("Please enter a valid Gmail address");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
     toast.error("Passwords do not match");
      setLoading(false);
      return;
    }



    try {
      const data = await signupUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (!data?.token) {
        toast.error("Signup failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("tasklane_token", data.token);
      localStorage.setItem("tasklane_user", JSON.stringify(data.user));

      toast.success("Signup successful");

      if(data.user.role === "manager")  navigate("/manager/dashboard");
      else
      navigate("/user/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* LEFT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-center px-16 border-r border-white/10 bg-zinc-950"
      >
        <h1 className="text-5xl font-bold mb-6">Build Your Workspace</h1>
        <p className="text-gray-400 max-w-md">
          Organize tasks, manage teams, and scale your productivity.
        </p>
      </motion.div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold mb-6">Create Account</h2>

       
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full rounded-lg bg-zinc-900 border border-white/10 px-4 py-3"
            />

            {/* EMAIL */}
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-lg bg-zinc-900 border border-white/10 px-4 py-3"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full rounded-lg bg-zinc-900 border border-white/10 px-4 py-3 pr-20"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full rounded-lg bg-zinc-900 border border-white/10 px-4 py-3 pr-20"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
              >
                {showConfirmPass ? "Hide" : "Show"}
              </button>
            </div>
            
            {/* ROLE SELECTION */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={form.role === "user"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-white"
                />
                <span>User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="manager"
                  checked={form.role === "manager"}
                  onChange={handleChange}
                  className="w-4 h-4 accent-white"
                />
                <span>Manager</span>
              </label>
            </div>

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="w-full bg-white text-black rounded-lg py-3 font-semibold"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-white">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
