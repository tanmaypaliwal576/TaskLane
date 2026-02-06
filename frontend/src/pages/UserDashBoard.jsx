import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gettasks, updatetask } from "../utils/api";
import { toast } from "react-hot-toast";

const UserDashboard = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
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
      completed: list.filter((t) => t.status === "Submitted").length,
      pending: list.filter(
        (t) =>
          t.status !== "Submitted" && new Date(t.deadline) >= now
      ).length,
      overdue: list.filter(
        (t) =>
          t.status !== "Submitted" && new Date(t.deadline) < now
      ).length,
    });
  };

  /* ---------------- LOADING STATS AT RENDER ---------------- */


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadTasksAndStats();
      setLoading(false);
    };
    load();
  }, []);

  /* ---------------- FILTERING AND SEARCHING ---------------- */

  useEffect(() => {
    let list = [...tasks];
    const now = new Date();

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (activeTab === "Pending")
      list = list.filter(
        (t) =>
          t.status !== "Submitted" &&
          new Date(t.deadline) >= now
      );

    if (activeTab === "Completed")
      list = list.filter((t) => t.status === "Submitted");

    if (activeTab === "Overdue")
      list = list.filter(
        (t) =>
          t.status !== "Submitted" &&
          new Date(t.deadline) < now
      );

    setFilteredTasks(list);
  }, [tasks, search, activeTab]);

  /* ---------------- SUBMIT ---------------- */

  const handlesubmit = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    const file = selectedFile[taskId];

    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    if (new Date() > new Date(task.deadline)) {
      toast.error("Deadline has passed. Cannot submit.");
      return;
    }

    try {
      await updatetask(taskId, "Submitted");
      toast.success("File submitted successfully");
      setSelectedFile((prev) => ({ ...prev, [taskId]: null }));
      loadTasksAndStats();
    } catch (error) {
      toast.error("Submission failed");
    }
  };

  /* ---------------- UNSUBMIT ---------------- */

  const handleUnsubmit = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);

    if (new Date() > new Date(task.deadline)) {
      toast.error("Deadline has passed. Cannot unsubmit.");
      return;
    }

    try {
      await updatetask(taskId, "Pending");
      toast.success("File unsubmitted successfully");
      loadTasksAndStats();
    } catch (error) {
      toast.error("Unsubmission failed");
    }
  };

  /* ----------------LOADING UI ---------------- */

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
          {["All", "Pending", "Completed", "Overdue"].map((tab) => (
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
          ))}
        </div>

        {/* TASKS */}
        <div className="flex flex-col gap-5">
          {filteredTasks.map((t) => (
            <div
              key={t._id}
              className="w-full bg-[#0F162B] p-6 rounded-2xl border border-white/10"
            >
              <h3 className="font-semibold text-xl">{t.title}</h3>
              <p className="text-white/50 text-sm mt-1">
                {t.description}
              </p>

              {/* Deadline + Status */}
              <div className="flex justify-end mt-4">
                <div className="flex items-center gap-4 bg-[#111827] border border-white/10 px-5 py-3 rounded-2xl shadow-md">
                  <div className="text-sm">
                    <p className="text-white/40 text-xs tracking-wide">
                      DEADLINE
                    </p>
                    <p className="text-white font-medium">
                      {new Date(t.deadline).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      t.status === "Submitted"
                        ? "bg-green-500/15 text-green-400"
                        : new Date(t.deadline) < new Date()
                        ? "bg-red-500/15 text-red-400"
                        : "bg-blue-500/15 text-blue-400"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>

              {/* Upload Section */}
              <div className="mt-6">
                {t.status !== "Submitted" ? (
                  <>
                    <input
                      type="file"
                      accept=".pdf,.docx,.png,.jpg,.jpeg"
                      disabled={
                        new Date() > new Date(t.deadline)
                      }
                      onChange={(e) =>
                        setSelectedFile((prev) => ({
                          ...prev,
                          [t._id]: e.target.files[0],
                        }))
                      }
                      className="block w-full text-sm text-white/70
                        file:mr-4
                        file:px-5 file:py-2
                        file:rounded-lg
                        file:border-0
                        file:bg-white
                        file:text-black
                        file:font-semibold
                        hover:file:bg-gray-200
                        disabled:opacity-50"
                    />

                    <button
                      disabled={
                        new Date() > new Date(t.deadline)
                      }
                      className={`mt-3 px-5 py-2 rounded-lg text-sm font-semibold ${
                        new Date() > new Date(t.deadline)
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-white text-black"
                      }`}
                      onClick={() => handlesubmit(t._id)}
                    >
                      Submit
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm">
                      ✔ Submitted Successfully
                    </div>

                    {t.materialUrl && (
                      <p className="text-xs text-white/50 mt-2">
                        Submitted File:{" "}
                        {t.materialUrl.split("/").pop()}
                      </p>
                    )}

                    <button
                      disabled={
                        new Date() > new Date(t.deadline)
                      }
                      className={`mt-3 px-5 py-2 rounded-lg text-sm font-semibold ${
                        new Date() > new Date(t.deadline)
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-red-400 text-black"
                      }`}
                      onClick={() => handleUnsubmit(t._id)}
                    >
                      Unsubmit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
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
