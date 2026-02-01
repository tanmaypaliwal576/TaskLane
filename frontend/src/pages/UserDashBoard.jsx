import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

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

  const token = localStorage.getItem("tasklane_token");
  const user = JSON.parse(localStorage.getItem("tasklane_user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("tasklane_token");
    localStorage.removeItem("tasklane_user");
    navigate("/login");
  };

  const fetchTasks = async () => {
    const res = await api.get("/users/mytasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data?.tasks || []);
  };

  const fetchStats = async () => {
    const res = await api.get("/users/mytasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const list = res.data?.tasks || [];
    const now = new Date();

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
      await fetchStats();
      await fetchTasks();
      setLoading(false);
    };
    load();
  }, []);

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
            className="bg-[#0F162B] px-4 py-2 rounded-xl outline-none w-full max-w-md"
          />

          {/* PROFILE DROPDOWN */}
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

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total" value={stats.total} />
          <StatCard title="Completed" value={stats.completed} />
          <StatCard title="Pending" value={stats.pending} />
          <StatCard title="Late" value={stats.overdue} />
        </div>

        <div className="flex gap-2 mb-6">
          {["All", "Pending", "In Progress", "Completed", "Overdue"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab
                    ? "bg-white text-black"
                    : "bg-[#0F162B]"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {filteredTasks.length === 0 ? (
            <p className="text-white/40">No tasks found</p>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t._id}
                className="bg-[#0F162B] p-5 rounded-xl border border-white/10"
              >
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-white/50 text-sm mt-1">
                  {t.description}
                </p>
                <p className="text-sm mt-3">
                  Status:{" "}
                  <span className="text-white/70">{t.status}</span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

function StatCard({ title, value }) {
  return (
    <div className="bg-[#0A0F1E] border border-white/10 rounded-xl p-5">
      <p className="text-white/50 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
