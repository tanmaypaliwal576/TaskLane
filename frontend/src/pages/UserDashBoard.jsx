import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  gettasks,
  updatetask,
} from "../utils/api";
import { toast } from "react-hot-toast";
const UserDashboard = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    dueSoon: 0,
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("tasklane_user") || "{}");

  /* ---------------- AUTH ---------------- */

  const handleLogout = () => {
    localStorage.removeItem("tasklane_token");
    localStorage.removeItem("tasklane_user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  /* ---------------- DATA FETCH ---------------- */

  const loadTasksAndStats = async () => {
    const data = await gettasks();
    const list = data?.tasks || [];
    const now = new Date();

    setTasks(list);
    setStats({
      total: list.length,
      completed: list.filter((t) => t.status === "done").length,
      pending: list.filter((t) => t.status !== "done").length,
      overdue: list.filter(
        (t) => t.status !== "done" && new Date(t.deadline) < now
      ).length,
      dueSoon: 0,
    });
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadTasksAndStats();
      setLoading(false);
    };
    load();
  }, []);

  /* ---------------- FILTERING ---------------- */

  useEffect(() => {
    let list = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (activeTab === "Pending") list = list.filter((t) => t.status === "todo");
    if (activeTab === "In Progress")
      list = list.filter((t) => t.status === "in-progress");
    if (activeTab === "Completed")
      list = list.filter((t) => t.status === "done");

    if (activeTab === "Overdue") {
      const now = new Date();
      list = list.filter(
        (t) => t.status !== "done" && new Date(t.deadline) < now
      );
    }

    setFilteredTasks(list);
  }, [tasks, search, activeTab]);

  /* ---------------- STATUS UPDATE ---------------- */

  const handleStatusChange = async (id, status) => {
    try {
      await updatetask(id, status);
      toast.success("Task Updated!!");
      loadTasksAndStats();
      // Optimistic UI update
      setTasks((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status: status } : t
        )
      );
    } catch (error) {
      console.error(error); 
      toast.error("Failed to update task");
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/60">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <div className="border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="bg-[#0F162B] px-4 py-2 rounded-xl outline-none w-full max-w-md text-sm"
          />

          {/* PROFILE */}
          <div className="relative ml-6">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 hover:bg-white/5 px-3 py-2 rounded-xl"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-white/50">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1B233A] flex items-center justify-center font-semibold">
                {(user?.name?.[0] || "U").toUpperCase()}
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
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">
          Welcome back, {user?.name}
        </h1>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total" value={stats.total} />
          <StatCard title="Completed" value={stats.completed} />
          <StatCard title="Pending" value={stats.pending} />
          <StatCard title="Late" value={stats.overdue} />
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["All", "Pending", "In Progress", "Completed", "Overdue"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  activeTab === tab
                    ? "bg-white text-black font-semibold"
                    : "bg-[#0F162B] text-white/70 hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* TASKS */}
        <div className="grid md:grid-cols-2 gap-5">
          {filteredTasks.length === 0 ? (
            <p className="text-white/40">No tasks found</p>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t._id}
                className="bg-[#0F162B] p-5 rounded-2xl border border-white/10 hover:border-white/20 transition"
              >
                <h3 className="font-semibold text-lg">{t.title}</h3>
                <p className="text-white/50 text-sm mt-1">{t.description}</p>

                <div className="flex items-center justify-between mt-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-white/40">Status</span>
                    <select
                      value={t.status}
                      onChange={(e) =>
                        handleStatusChange(t._id, e.target.value)
                      }
                      className="bg-[#0B1222] border border-white/10 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="todo">🕒 Pending</option>
                      <option value="in-progress">⚡ In Progress</option>
                      <option value="done">✅ Completed</option>
                    </select>
                  </div>

                  <div className="text-xs text-white/40 text-right">
                    <span className="block">Deadline</span>
                    <span className="text-white/70">
                      {new Date(t.deadline).toDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

/* ---------------- STAT CARD ---------------- */

function StatCard({ title, value }) {
  return (
    <div className="bg-[#0A0F1E] border border-white/10 rounded-xl p-5">
      <p className="text-white/50 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
