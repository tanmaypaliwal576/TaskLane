import React, { useEffect, useState } from "react";
import { getallusers , createtask , getallmanagertasks} from "../utils/api";
import { useNavigate } from "react-router-dom";
import { all } from "axios";


const ManagerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("tasklane_user") || "{}");

  /* ---------------- STATE ---------------- */

  const [users, setUsers] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);

  const [managertasks , setmanagertasks] = useState([])


  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
    assignedTo: "",
  });

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const data = await getallusers();
      const loggedInUser = JSON.parse(
        localStorage.getItem("tasklane_user") || "{}"
      );

      const filteredUsers = data.users.filter(
        (u) => u._id !== loggedInUser._id && u.role === "user"
      );

      setUsers(filteredUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  fetchUsers();
}, []);



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await createtask(form);

    // Option A (best): refetch
    const updated = await getallmanagertasks();
    setmanagertasks(updated.tasks);

    // Reset form
    setForm({
      title: "",
      description: "",
      priority: "medium",
      deadline: "",
      assignedTo: "",
    });
  } catch (error) {
    console.error("Error creating task:", error);
  }
};



useEffect(()=>{
    const tasks = async()=>{
        const allmanagertasks = await getallmanagertasks();
        setmanagertasks(allmanagertasks.tasks);
    }
    tasks();
} , [])

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

 

  const handleLogout = () => {
    localStorage.removeItem("tasklane_token");
    localStorage.removeItem("tasklane_user");
    navigate("/login");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <div className="border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Tasklane · Manager</h1>

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-3 hover:bg-white/5 px-3 py-2 rounded-xl"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-white/50">{user?.email}</p>
              </div>

              <div className="w-10 h-10 rounded-full bg-[#1B233A] flex items-center justify-center font-semibold">
                {(user?.name?.[0] || "M").toUpperCase()}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#0F162B] border border-white/10 rounded-xl shadow-xl z-50">
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-white/5"
                >
                  Contact Us
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">

        {/* LEFT: CREATE TASK */}
        <div className="lg:col-span-2 bg-[#0A0F1E] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">
            Create & Assign Task
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="text-sm text-white/60">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="mt-1 w-full bg-[#0F162B] border border-white/10 rounded-xl px-4 py-3 outline-none"
                placeholder="Task title"
              />
            </div>

            <div>
              <label className="text-sm text-white/60">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full bg-[#0F162B] border border-white/10 rounded-xl px-4 py-3 outline-none resize-none"
                placeholder="Task description"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-white/60">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="mt-1 w-full bg-[#0F162B] border border-white/10 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-white/60">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full bg-[#0F162B] border border-white/10 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-white/60">Assign To</label>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full bg-[#0F162B] border border-white/10 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-fit px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90"
       
            >
              Create Task
            </button>
          </form>
        </div>

        {/* RIGHT: USERS LIST */}
        <div className="bg-[#0A0F1E] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Tasks Assigned</h2>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {managertasks.length === 0 ? (
              <p className="text-white/40 text-sm">No Tasks Assigned</p>
            ) : (
             managertasks.map((u) => (
  <div
    key={u._id}
    className="mt-2 bg-[#0B1222] border border-white/10 rounded-xl p-3 space-y-2"
  >
    <p className="text-sm font-semibold text-white/90">
      📌 Task:
      <span className="ml-1 text-white/70">{u.title}</span>
    </p>

    <p className="text-xs text-white/50 flex items-center gap-1">
      👤 Assigned To:
      <span className="ml-1 font-medium text-sky-400">
        {u.assignedTo?.name || "Unknown"}
      </span>
    </p>

    <p className="text-xs text-white/50 flex items-center gap-1">
      ✉️ {u.assignedTo?.email || "No email"}
    </p>
  </div>
))

            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerDashboard;
