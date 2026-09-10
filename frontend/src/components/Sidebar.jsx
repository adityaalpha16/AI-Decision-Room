import {
  BarChart3,
  Bot,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  UserRound,
  LogOut,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  }

  function handleProfile() {
    navigate("/dashboard?panel=profile");
  }

  function handleSettings() {
    navigate("/dashboard?panel=settings");
  }

  return (
    <aside className="fixed bottom-3 left-3 top-3 z-20 hidden w-56 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/30 shadow-2xl shadow-black/20 backdrop-blur-2xl lg:block">
      
      {/* Ambient glass glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full bg-blue-500/[0.08] blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -right-20 h-44 w-44 rounded-full bg-violet-500/[0.05] blur-3xl" />

      {/* Logo */}
      <div className="relative flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/[0.08] shadow-lg shadow-blue-500/[0.05]">
          <Sparkles
            size={19}
            className="text-blue-400"
          />
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wide">
            AI DECISION
          </p>

          <p className="text-[10px] tracking-[0.35em] text-blue-400">
            ROOM
          </p>
        </div>
      </div>

      <div className="mx-4 h-px bg-white/[0.06]" />

      {/* Main */}
      <div className="relative px-3 py-4">
        <p className="mb-3 px-3 text-[10px] font-medium tracking-wider text-slate-600">
          MAIN
        </p>

        <SidebarItem
          icon={<LayoutDashboard size={17} />}
          label="Dashboard"
          active={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        />

        <SidebarItem
          icon={<Plus size={17} />}
          label="New Decision"
          active={location.pathname === "/new-decision"}
          onClick={() => navigate("/new-decision")}
        />

        <SidebarItem
          icon={<FileText size={17} />}
          label="Decisions"
          active={location.pathname === "/decisions"}
          onClick={() => navigate("/decisions")}
        />

        <SidebarItem
          icon={<Bot size={17} />}
          label="AI Agents"
          active={location.pathname === "/agents"}
          onClick={() => navigate("/agents")}
        />
      </div>

      <div className="mx-4 h-px bg-white/[0.06]" />

      {/* Tools */}
      <div className="relative px-3 py-4">
        <p className="mb-3 px-3 text-[10px] font-medium tracking-wider text-slate-600">
          TOOLS
        </p>

        <SidebarItem
          icon={<BarChart3 size={17} />}
          label="Reports"
          active={location.pathname === "/reports"}
          onClick={() => navigate("/reports")}
        />
      </div>

      {/* Bottom */}
      <div className="absolute bottom-3 left-3 right-3">

        {/* Profile */}
        <SidebarItem
          icon={<UserRound size={17} />}
          label="Profile"
          active={
            location.pathname === "/dashboard" &&
            new URLSearchParams(location.search).get("panel") === "profile"
          }
          onClick={handleProfile}
        />

        {/* Settings */}
        <SidebarItem
          icon={<Settings size={17} />}
          label="Settings"
          active={
            location.pathname === "/dashboard" &&
            new URLSearchParams(location.search).get("panel") === "settings"
          }
          onClick={handleSettings}
        />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 transition-all duration-200 hover:bg-red-500/[0.06] hover:text-red-300"
        >
          <LogOut
            size={17}
            className="text-slate-500 transition group-hover:text-red-400"
          />

          Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`group mb-1 flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 ${
        active
          ? "border-blue-400/15 bg-blue-500/[0.08] text-blue-300 shadow-sm shadow-blue-500/[0.03]"
          : "border-transparent text-slate-500 hover:border-white/[0.05] hover:bg-white/[0.035] hover:text-slate-200"
      }`}
    >
      <span
        className={
          active
            ? "text-blue-400"
            : "text-slate-500 transition group-hover:text-slate-300"
        }
      >
        {icon}
      </span>

      {label}
    </button>
  );
}

export default Sidebar;