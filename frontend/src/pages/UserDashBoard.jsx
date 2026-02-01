import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
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

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("tasklane_token");
    localStorage.removeItem("tasklane_user");
    navigate("/login");
  };

  // ✅ Fetch stats
  const fetchStats = async () => {
    try {
      const res = await api.get("/users/mytasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res?.data || {};
      const tasks = data?.tasks || [];

      const total = data.total ?? tasks.length;

      const completed = tasks.filter((t) => t.status === "done").length;
      const pending = tasks.filter((t) => t.status !== "done").length;

      const now = new Date();
      const overdue = tasks.filter(
        (t) => t.status !== "done" && new Date(t.deadline) < now,
      ).length;

      setStats({
        total,
        completed,
        pending,
        overdue,
        dueSoon: 0, // (we can add later)
      });
    } catch (err) {
      console.log("Stats fetch error:", err);

      // ✅ fallback defaults
      setStats({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        dueSoon: 0,
      });
    }
  };

  // ✅ Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/users/mytasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data?.tasks || []);
    } catch (err) {
      console.log("Tasks fetch error:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchStats();
      await fetchTasks();
      setLoading(false);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
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
        (t) => t.status !== "done" && new Date(t.deadline) < now,
      );
    }

    return list;
  }, [tasks, search, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B13] flex items-center justify-center text-white/60">
        Loading...
      </div>
    );
  }

 // KEEP YOUR IMPORTS + LOGIC SAME
// Only return JSX changed

return (
  <div className="min-h-screen bg-black text-white">
    {/* NAVBAR */}
    <div className="border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-3 bg-[#0F162B] border border-white/10 rounded-xl px-4 py-3">
            <span className="text-white/40">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 ml-6">
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
        </div>
      </div>
    </div>

    {/* CONTENT */}
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Welcome back, {user?.name}
        </h1>
        <p className="text-white/50 mt-2">
          Here's an overview of your assigned tasks
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-5">
        <StatCard title="Total Tasks" value={stats.total} icon="📋" />
        <StatCard title="Completed" value={stats.completed} icon="✅" />
        <StatCard title="Pending" value={stats.pending} icon="🕒" />
        <StatCard title="Late" value={stats.overdue} icon="⚠️" />
      </div>

      {/* Tasks */}
      <div className="mt-8 bg-[#0A0F1E] border border-white/10 rounded-2xl p-6">
        {/* Header Row */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl font-semibold">My Assigned Tasks</h2>

          <div className="flex bg-[#0F162B] border border-white/10 rounded-xl p-1">
            <Tab label="All" active={activeTab==="All"} onClick={()=>setActiveTab("All")} />
            <Tab label="Pending" active={activeTab==="Pending"} onClick={()=>setActiveTab("Pending")} />
            <Tab label="In Progress" active={activeTab==="In Progress"} onClick={()=>setActiveTab("In Progress")} />
            <Tab label="Completed" active={activeTab==="Completed"} onClick={()=>setActiveTab("Completed")} />
            <Tab label="Overdue" active={activeTab==="Overdue"} onClick={()=>setActiveTab("Overdue")} />
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {filteredTasks.length === 0 ? (
            <p className="text-white/40">No tasks found</p>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task._id}
                title={task.title}
                desc={task.description}
                priority={task.priority}
                status={task.status}
                date={formatDate(task.deadline)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);

};

export default UserDashboard;

/* ---------------- Components ---------------- */

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[#0A0F1E] border border-white/10 rounded-2xl p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm transition
        ${
          active
            ? "bg-white text-black font-semibold"
            : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
    >
      {label}
    </button>
  );
}

function TaskCard({ title, desc, priority, status, date }) {
  const priorityStyle = getPriorityStyle(priority);
  const statusStyle = getStatusStyle(status);

  return (
    <div className="bg-[#0F162B] border border-white/10 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white/95">{title}</h3>
          <p className="text-sm text-white/50 mt-1">{desc}</p>
        </div>

        <button className="text-white/40 hover:text-white/70 transition">
          ⋮
        </button>
      </div>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className={`px-3 py-1 rounded-full text-xs ${priorityStyle}`}>
          {capitalize(priority)}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs ${statusStyle}`}>
          {statusLabel(status)}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-white/50">
        <span>📅</span>
        <span>{date}</span>
      </div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function statusLabel(status) {
  if (status === "todo") return "Pending";
  if (status === "in-progress") return "In Progress";
  if (status === "done") return "Completed";
  return status;
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toDateString();
}

function getPriorityStyle(priority) {
  if (priority === "high")
    return "bg-red-500/15 text-red-200 border border-red-500/20";
  if (priority === "medium")
    return "bg-amber-500/15 text-amber-200 border border-amber-500/20";
  return "bg-emerald-500/15 text-emerald-200 border border-emerald-500/20";
}

function getStatusStyle(status) {
  if (status === "done")
    return "bg-emerald-500/15 text-emerald-200 border border-emerald-500/20";
  if (status === "in-progress")
    return "bg-sky-500/15 text-sky-200 border border-sky-500/20";
  return "bg-zinc-500/15 text-zinc-200 border border-zinc-500/20";
}
