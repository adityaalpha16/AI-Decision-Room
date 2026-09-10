import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowUpRight,
  Bot,
  Brain,
  FileText,
  Lightbulb,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  X,
  LockKeyhole,
  Mail,
  UserRound,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import BackgroundFX from "../components/BackgroundFX";

function Dashboard() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const storedUser =
    JSON.parse(
      localStorage.getItem("user") || "null"
    );

  const [user, setUser] =
    useState(storedUser);

  const name =
    user?.name || "Aditya";

  /* ====================================================== */
  /* DASHBOARD STATE */
  /* ====================================================== */

  const [decisions, setDecisions] =
    useState([]);

  const [reportCount, setReportCount] =
    useState(0);

  const [averageConfidence, setAverageConfidence] =
    useState(0);

  const [analysisCount, setAnalysisCount] =
    useState(0);

  const [decisionStats, setDecisionStats] =
    useState({
      total: 0,
      completed: 0,
      processing: 0,
      pending: 0,
      failed: 0,
    });

  const [latestReport, setLatestReport] =
    useState(null);

  const [loadingDecisions, setLoadingDecisions] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ====================================================== */
  /* PROFILE STATE */
  /* ====================================================== */

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [profileName, setProfileName] =
    useState("");

  const [profileEmail, setProfileEmail] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [profileError, setProfileError] =
    useState("");

  const [profileSuccess, setProfileSuccess] =
    useState("");

  /* ====================================================== */
  /* SETTINGS STATE */
  /* ====================================================== */

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [showConfidenceScores, setShowConfidenceScores] =
    useState(
      localStorage.getItem(
        "showConfidenceScores"
      ) !== "false"
    );

  const [showAIRecommendation, setShowAIRecommendation] =
    useState(
      localStorage.getItem(
        "showAIRecommendation"
      ) !== "false"
    );

  /* ====================================================== */
  /* PROFILE */
  /* ====================================================== */

  function openProfile() {
    setProfileName(
      user?.name || ""
    );

    setProfileEmail(
      user?.email || ""
    );

    setCurrentPassword("");
    setNewPassword("");

    setProfileError("");
    setProfileSuccess("");

    setProfileOpen(true);
  }

  function closeProfile() {
    if (profileLoading) {
      return;
    }

    setProfileOpen(false);
    setSearchParams({});
  }

  /* ====================================================== */
  /* SETTINGS */
  /* ====================================================== */

  function closeSettings() {
    setSettingsOpen(false);
    setSearchParams({});
  }

  function updateConfidenceSetting(
    value
  ) {
    setShowConfidenceScores(value);

    localStorage.setItem(
      "showConfidenceScores",
      String(value)
    );
  }

  function updateRecommendationSetting(
    value
  ) {
    setShowAIRecommendation(value);

    localStorage.setItem(
      "showAIRecommendation",
      String(value)
    );
  }

  function resetPreferences() {
    setShowConfidenceScores(true);
    setShowAIRecommendation(true);

    localStorage.setItem(
      "showConfidenceScores",
      "true"
    );

    localStorage.setItem(
      "showAIRecommendation",
      "true"
    );
  }

  /* ====================================================== */
  /* HANDLE SIDEBAR PANELS */
  /* ====================================================== */

  useEffect(() => {
    const panel =
      searchParams.get("panel");

    if (panel === "profile") {
      openProfile();
    }

    if (panel === "settings") {
      setSettingsOpen(true);
    }
  }, [searchParams]);

  /* ====================================================== */
  /* UPDATE PROFILE */
  /* ====================================================== */

  async function handleProfileUpdate(
    event
  ) {
    event.preventDefault();

    setProfileError("");
    setProfileSuccess("");

    if (!profileName.trim()) {
      setProfileError(
        "Username cannot be empty."
      );

      return;
    }

    if (
      !profileEmail.trim() ||
      !profileEmail.includes("@")
    ) {
      setProfileError(
        "Please provide a valid email."
      );

      return;
    }

    if (
      newPassword &&
      !currentPassword
    ) {
      setProfileError(
        "Enter your current password to set a new password."
      );

      return;
    }

    if (
      newPassword &&
      newPassword.length < 8
    ) {
      setProfileError(
        "New password must be at least 8 characters."
      );

      return;
    }

    try {
      setProfileLoading(true);

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          "http://localhost:5001/api/auth/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name:
                profileName.trim(),

              email:
                profileEmail
                  .trim()
                  .toLowerCase(),

              currentPassword:
                currentPassword ||
                undefined,

              newPassword:
                newPassword ||
                undefined,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile."
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      setUser(data.user);

      setProfileSuccess(
        "Profile updated successfully."
      );

      setCurrentPassword("");
      setNewPassword("");

      setTimeout(() => {
        setProfileOpen(false);
        setSearchParams({});
      }, 900);

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setProfileError(
        error.message ||
          "Something went wrong."
      );

    } finally {
      setProfileLoading(false);
    }
  }

  /* ====================================================== */
  /* FETCH DASHBOARD DATA */
  /* ====================================================== */

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoadingDecisions(true);
        setError("");

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          navigate("/login");
          return;
        }

        const response =
          await fetch(
            "http://localhost:5001/api/decisions",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        console.log(
          "Dashboard data:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch dashboard data"
          );
        }

        setDecisions(
          data.decisions || []
        );

        setReportCount(
          data.reportCount || 0
        );

        setAverageConfidence(
          data.averageConfidence || 0
        );

        setAnalysisCount(
          data.analysisCount || 0
        );

        setDecisionStats(
          data.decisionStats || {
            total: 0,
            completed: 0,
            processing: 0,
            pending: 0,
            failed: 0,
          }
        );

        setLatestReport(
          data.latestReport ||
            null
        );

      } catch (error) {
        console.error(
          "Fetch dashboard data error:",
          error
        );

        setError(
          error.message
        );

      } finally {
        setLoadingDecisions(false);
      }
    }

    fetchDashboardData();
  }, [navigate]);

  /* ====================================================== */
  /* UI */
  /* ====================================================== */

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-white">

      <BackgroundFX />

      <Sidebar />

      <main className="relative z-10 min-h-screen p-3 lg:ml-60">

        {/* ================================================= */}
        {/* TOP BAR */}
        {/* ================================================= */}

        <header className="mb-3 flex min-h-16 items-center rounded-2xl border border-white/[0.08] bg-slate-950/25 px-4 py-2 shadow-xl shadow-black/10 backdrop-blur-2xl">

          {/* Quote */}

          <div className="flex flex-1 items-center justify-center">

            <p className="font-serif text-sm italic tracking-wide text-blue-100/65 md:text-base">

              Four Perspectives,

              <span className="mx-1.5 text-blue-400/80">
                One Smart Choice.
              </span>

            </p>

          </div>

          {/* Profile */}

          <div className="flex items-center">

            <button
              onClick={openProfile}
              className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 text-left transition hover:border-white/[0.08] hover:bg-white/[0.035]"
              title="Open profile settings"
            >

              <div className="hidden text-right sm:block">

                <p className="text-xs font-medium text-white">
                  {name}
                </p>

                <p className="mt-0.5 text-[10px] text-blue-400/80">
                  Account
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/25 bg-blue-500/[0.12] text-xs font-semibold text-blue-200 shadow-lg shadow-blue-500/[0.08] transition group-hover:border-blue-400/40 group-hover:bg-blue-500/[0.18]">
                {getInitials(name)}
              </div>

            </button>

          </div>

        </header>

        {/* ================================================= */}
        {/* MAIN GLASS CONTAINER */}
        {/* ================================================= */}

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/20 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl md:p-5">

          {/* Ambient glow */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-blue-500/[0.035] blur-3xl" />

          {/* ================================================= */}
          {/* WELCOME */}
          {/* ================================================= */}

          <div className="relative mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="mb-2 text-xs font-medium tracking-[0.18em] text-blue-400">
                DECISION ROOM
              </p>

              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Welcome back, {name}! 👋
              </h1>

              <p className="mt-2 text-xs text-slate-500">
                Make smarter decisions with multiple AI perspectives.
              </p>

            </div>

            <button
              onClick={() =>
                navigate(
                  "/new-decision"
                )
              }
              className="group flex w-fit items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-600/85 px-4 py-2.5 text-xs font-semibold shadow-lg shadow-blue-500/[0.08] transition hover:border-blue-300/30 hover:bg-blue-500"
            >

              <Plus size={15} />

              New Decision

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />

            </button>

          </div>

          {/* ================================================= */}
          {/* STATISTICS */}
          {/* ================================================= */}

          <div className="relative mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={
                <FileText size={17} />
              }
              label="Total Decisions"
              value={
                decisions.length
              }
              change="All time"
            />

            <StatCard
              icon={
                <FileText size={17} />
              }
              label="Reports Generated"
              value={
                reportCount
              }
              change="All time"
            />

            <StatCard
              icon={
                <Brain size={17} />
              }
              label="Avg. Confidence"
              value={`${averageConfidence}%`}
              change="Current"
            />

            <StatCard
              icon={
                <Bot size={17} />
              }
              label="AI Analyses"
              value={
                analysisCount
              }
              change="All time"
            />

          </div>

          {/* ================================================= */}
          {/* MAIN COLUMNS */}
          {/* ================================================= */}

          <div className="relative grid grid-cols-1 gap-4 xl:grid-cols-12">

            {/* LEFT */}

            <div className="space-y-4 xl:col-span-8">

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                {/* ================================================= */}
                {/* RECENT DECISIONS */}
                {/* ================================================= */}

                <Panel
                  title="Recent Decisions"
                  action="View all"
                  onAction={() =>
                    navigate(
                      "/decisions"
                    )
                  }
                >

                  <div className="space-y-1">

                    {loadingDecisions ? (

                      <p className="px-2 py-4 text-xs text-slate-500">
                        Loading decisions...
                      </p>

                    ) : error ? (

                      <p className="px-2 py-4 text-xs text-red-400">
                        {error}
                      </p>

                    ) : decisions.length === 0 ? (

                      <p className="px-2 py-4 text-xs text-slate-500">
                        No decisions created yet.
                      </p>

                    ) : (

                      decisions
                        .slice(0, 5)
                        .map(
                          (
                            decision
                          ) => (

                            <DecisionRow
                              key={
                                decision.id
                              }

                              icon={
                                <FileText size={16} />
                              }

                              title={
                                decision.title
                              }

                              date={formatDate(
                                decision.created_at
                              )}

                              score={
                                decision.status ===
                                "completed"
                                  ? "✓"
                                  : "—"
                              }

                              impact={formatStatus(
                                decision.status
                              )}

                              onClick={() =>
                                navigate(
                                  `/decisions/${decision.id}`
                                )
                              }
                            />

                          )
                        )

                    )}

                  </div>

                </Panel>

                {/* ================================================= */}
                {/* AI AGENT OVERVIEW */}
                {/* ================================================= */}

                <Panel
                  title="AI Agent Overview"
                  action="View all agents"
                  onAction={() =>
                    navigate(
                      "/agents"
                    )
                  }
                >

                  <div className="space-y-2.5">

                    <AgentRow
                      icon={
                        <Target size={16} />
                      }
                      name="Strategist"
                      description="Focuses on long-term planning and strategic impact."
                      confidence="92%"
                      showConfidence={
                        showConfidenceScores
                      }
                    />

                    <AgentRow
                      icon={
                        <TrendingUp size={16} />
                      }
                      name="Analyst"
                      description="Data-driven analysis and logical reasoning."
                      confidence="88%"
                      showConfidence={
                        showConfidenceScores
                      }
                    />

                    <AgentRow
                      icon={
                        <Target size={16} />
                      }
                      name="Critic"
                      description="Challenges assumptions and highlights risks."
                      confidence="85%"
                      showConfidence={
                        showConfidenceScores
                      }
                    />

                    <AgentRow
                      icon={
                        <Sparkles size={16} />
                      }
                      name="Optimist"
                      description="Explores opportunities and potential upside."
                      confidence="90%"
                      showConfidence={
                        showConfidenceScores
                      }
                    />

                  </div>

                </Panel>

              </div>

            </div>

            {/* RIGHT */}

            <div className="space-y-4 xl:col-span-4">

              {/* ================================================= */}
              {/* DECISION STATUS */}
              {/* ================================================= */}

              <Panel
                title="Decision Status Overview"
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-[13px] border-violet-500/70">

                    <div className="absolute inset-2 rounded-full border-[11px] border-blue-500/60" />

                    <div className="absolute inset-5 rounded-full border-[9px] border-emerald-500/50" />

                    <div className="z-10 text-center">

                      <p className="text-2xl font-semibold">
                        {decisionStats.total}
                      </p>

                      <p className="text-[9px] text-slate-600">
                        Total
                      </p>

                    </div>

                  </div>

                  <div className="space-y-3">

                    <ImpactItem
                      label="Completed"
                      value={
                        decisionStats.completed
                      }
                      percent={getPercentage(
                        decisionStats.completed,
                        decisionStats.total
                      )}
                    />

                    <ImpactItem
                      label="Processing"
                      value={
                        decisionStats.processing
                      }
                      percent={getPercentage(
                        decisionStats.processing,
                        decisionStats.total
                      )}
                    />

                    <ImpactItem
                      label="Pending"
                      value={
                        decisionStats.pending
                      }
                      percent={getPercentage(
                        decisionStats.pending,
                        decisionStats.total
                      )}
                    />

                    <ImpactItem
                      label="Failed"
                      value={
                        decisionStats.failed
                      }
                      percent={getPercentage(
                        decisionStats.failed,
                        decisionStats.total
                      )}
                    />

                  </div>

                </div>

              </Panel>

              {/* ================================================= */}
              {/* AI RECOMMENDATION */}
              {/* ================================================= */}

              {showAIRecommendation && (

                <RecommendationCard
                  report={
                    latestReport
                  }

                  onClick={() => {

                    if (
                      latestReport?.decision_id
                    ) {

                      navigate(
                        `/decisions/${latestReport.decision_id}`
                      );

                    }

                  }}
                />

              )}

            </div>

          </div>

        </section>

      </main>

      {/* ====================================================== */}
      {/* PROFILE MODAL */}
      {/* ====================================================== */}

      {profileOpen && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"

          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closeProfile();

            }

          }}
        >

          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto overflow-hidden rounded-3xl border border-white/[0.12] bg-slate-950/70 shadow-2xl shadow-black/40 backdrop-blur-2xl">

            {/* Glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-blue-500/[0.08] blur-3xl" />

            {/* Header */}

            <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-5">

              <div>

                <p className="text-[10px] font-medium tracking-[0.2em] text-blue-400">
                  ACCOUNT
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Profile Settings
                </h2>

              </div>

              <button
                onClick={
                  closeProfile
                }
                disabled={
                  profileLoading
                }
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
              >

                <X size={18} />

              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={
                handleProfileUpdate
              }
              className="relative space-y-5 p-6"
            >

              {/* Avatar */}

              <div className="flex flex-col items-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-400/25 bg-blue-500/[0.10] text-lg font-semibold text-blue-200 shadow-xl shadow-blue-500/[0.08]">

                  {getInitials(
                    profileName ||
                      name
                  )}

                </div>

                <p className="mt-3 text-sm font-medium">
                  {profileName ||
                    name}
                </p>

                <p className="mt-1 text-[10px] text-slate-600">
                  Update your account information
                </p>

              </div>

              {/* Error */}

              {profileError && (

                <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.05] p-3 text-xs text-red-400">

                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {profileError}
                  </span>

                </div>

              )}

              {/* Success */}

              {profileSuccess && (

                <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/[0.05] p-3 text-xs text-green-400">

                  <CheckCircle2
                    size={15}
                  />

                  {profileSuccess}

                </div>

              )}

              {/* Username */}

              <ProfileInput
                icon={
                  <UserRound size={16} />
                }
                label="Username"
                value={
                  profileName
                }
                onChange={(event) =>
                  setProfileName(
                    event.target.value
                  )
                }
                placeholder="Your name"
              />

              {/* Email */}

              <ProfileInput
                icon={
                  <Mail size={16} />
                }
                label="Email"
                type="email"
                value={
                  profileEmail
                }
                onChange={(event) =>
                  setProfileEmail(
                    event.target.value
                  )
                }
                placeholder="you@example.com"
              />

              <div className="h-px bg-white/[0.06]" />

              {/* Password */}

              <div>

                <div className="flex items-center gap-2">

                  <LockKeyhole
                    size={15}
                    className="text-blue-400"
                  />

                  <p className="text-xs font-medium text-slate-300">
                    Change Password
                  </p>

                </div>

                <p className="mt-1 text-[10px] leading-4 text-slate-600">
                  Leave these fields empty if you don't want to change your password.
                </p>

              </div>

              <ProfileInput
                icon={
                  <LockKeyhole size={16} />
                }
                label="Current Password"
                type="password"
                value={
                  currentPassword
                }
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
                placeholder="Enter current password"
              />

              <ProfileInput
                icon={
                  <LockKeyhole size={16} />
                }
                label="New Password"
                type="password"
                value={
                  newPassword
                }
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                placeholder="Minimum 8 characters"
              />

              {/* Actions */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={
                    closeProfile
                  }
                  disabled={
                    profileLoading
                  }
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    profileLoading
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {profileLoading ? (

                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />

                      Saving...
                    </>

                  ) : (

                    <>
                      <Save size={15} />

                      Save Changes
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ====================================================== */}
      {/* SETTINGS MODAL */}
      {/* ====================================================== */}

      {settingsOpen && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"

          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closeSettings();

            }

          }}
        >

          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.12] bg-slate-950/70 shadow-2xl shadow-black/40 backdrop-blur-2xl">

            {/* Glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-blue-500/[0.08] blur-3xl" />

            {/* Header */}

            <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-5">

              <div>

                <p className="text-[10px] font-medium tracking-[0.2em] text-blue-400">
                  PREFERENCES
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Settings
                </h2>

                <p className="mt-1 text-[10px] text-slate-600">
                  Customize your decision room experience.
                </p>

              </div>

              <button
                onClick={
                  closeSettings
                }
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
              >

                <X size={18} />

              </button>

            </div>

            {/* Settings */}

            <div className="relative space-y-4 p-6">

              <SettingToggle
                title="Show Confidence Scores"
                description="Display AI confidence scores throughout the dashboard."
                enabled={
                  showConfidenceScores
                }
                onChange={
                  updateConfidenceSetting
                }
              />

              <SettingToggle
                title="Show AI Recommendation"
                description="Display the latest AI recommendation on the dashboard."
                enabled={
                  showAIRecommendation
                }
                onChange={
                  updateRecommendationSetting
                }
              />

              <div className="h-px bg-white/[0.06]" />

              <button
                onClick={
                  resetPreferences
                }
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
              >
                Reset Preferences
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* ====================================================== */
/* PROFILE INPUT */
/* ====================================================== */

function ProfileInput({
  icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-slate-600">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 transition focus-within:border-blue-400/30 focus-within:bg-black/25">

        <span className="text-slate-600">
          {icon}
        </span>

        <input
          type={type}
          value={
            value
          }
          onChange={
            onChange
          }
          placeholder={
            placeholder
          }
          className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-700"
        />

      </div>

    </div>
  );
}

/* ====================================================== */
/* STAT CARD */
/* ====================================================== */

function StatCard({
  icon,
  label,
  value,
  change,
}) {
  return (
    <div className="group rounded-xl border border-white/[0.08] bg-white/[0.018] p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/20 hover:bg-white/[0.035]">

      <div className="flex items-center justify-between">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-500/[0.07] text-blue-400">
          {icon}
        </div>

      </div>

      <p className="mt-4 text-[10px] text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-600">
        {change}
      </p>

    </div>
  );
}

/* ====================================================== */
/* PANEL */
/* ====================================================== */

function Panel({
  title,
  action,
  onAction,
  children,
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.018] p-4 backdrop-blur-xl transition duration-300 hover:border-white/[0.12]">

      <div className="mb-3 flex items-center justify-between">

        <h2 className="text-sm font-semibold">
          {title}
        </h2>

        {action && (

          <button
            onClick={
              onAction
            }
            className="text-[10px] text-blue-400 transition hover:text-blue-300"
          >
            {action}
          </button>

        )}

      </div>

      {children}

    </div>
  );
}

/* ====================================================== */
/* DECISION ROW */
/* ====================================================== */

function DecisionRow({
  icon,
  title,
  date,
  score,
  impact,
  onClick,
}) {
  return (
    <button
      onClick={
        onClick
      }
      className="group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-white/[0.035]"
    >

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-500/[0.07] text-blue-400">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-[11px] font-medium">
          {title}
        </p>

        <p className="mt-0.5 text-[9px] text-slate-600">
          {date} · {impact}
        </p>

      </div>

      <span className="hidden rounded-md bg-blue-500/[0.07] px-2 py-1 text-[9px] text-blue-300 md:block">
        {impact}
      </span>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-400/20 text-[10px] text-blue-300">
        {score}
      </div>

    </button>
  );
}

/* ====================================================== */
/* AGENT ROW */
/* ====================================================== */

function AgentRow({
  icon,
  name,
  description,
  confidence,
  showConfidence = true,
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/[0.10] p-3 backdrop-blur-md">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-500/[0.07] text-blue-400">
          {icon}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center justify-between">

            <p className="text-[11px] font-medium">
              {name}
            </p>

            {showConfidence && (

              <span className="text-[9px] text-slate-500">
                {confidence}
              </span>

            )}

          </div>

          <p className="mt-1 truncate text-[9px] text-slate-600">
            {description}
          </p>

        </div>

      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">

        <div
          className="h-full rounded-full bg-blue-500/80 transition-all"
          style={{
            width:
              confidence,
          }}
        />

      </div>

    </div>
  );
}

/* ====================================================== */
/* IMPACT ITEM */
/* ====================================================== */

function ImpactItem({
  label,
  value,
  percent,
}) {
  return (
    <div className="flex items-center gap-2">

      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

      <div>

        <p className="text-[10px] text-slate-400">
          {label}
        </p>

        <p className="text-[9px] text-slate-600">
          {value} ({percent})
        </p>

      </div>

    </div>
  );
}

/* ====================================================== */
/* RECOMMENDATION */
/* ====================================================== */

function RecommendationCard({
  report,
  onClick,
}) {
  if (!report) {

    return (

      <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.055] to-blue-500/[0.025] p-5 backdrop-blur-xl">

        <div className="flex items-center gap-2">

          <Lightbulb
            size={17}
            className="text-violet-400"
          />

          <h2 className="text-sm font-semibold">
            AI Recommendation
          </h2>

        </div>

        <p className="mt-4 text-xs leading-6 text-slate-500">
          Generate a final report to see your AI recommendation here.
        </p>

      </div>

    );
  }

  const recommendation =
    report.final_recommendation ||
    report.recommendation ||
    report.summary ||
    "No recommendation available.";

  return (

    <button
      onClick={
        onClick
      }
      className="w-full rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.055] to-blue-500/[0.025] p-5 text-left backdrop-blur-xl transition hover:border-violet-400/25 hover:bg-violet-500/[0.08]"
    >

      <div className="flex items-center gap-2">

        <Lightbulb
          size={17}
          className="text-violet-400"
        />

        <h2 className="text-sm font-semibold">
          AI Recommendation
        </h2>

      </div>

      <div className="mt-4 flex gap-3">

        <span className="text-3xl leading-none text-violet-500/80">
          “
        </span>

        <p className="line-clamp-4 text-xs leading-6 text-slate-400">
          {recommendation}
        </p>

      </div>

      <div className="mt-5 flex items-center justify-between gap-3">

        <div className="flex items-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-500/[0.07]">

            <Bot
              size={14}
              className="text-blue-400"
            />

          </div>

          <div>

            <p className="text-[11px] font-medium">
              AI Decision Report
            </p>

            <p className="text-[9px] text-slate-600">
              Latest recommendation
            </p>

          </div>

        </div>

        {report.confidence !==
          null &&
          report.confidence !==
            undefined && (

          <div className="text-right">

            <p className="text-sm font-semibold text-blue-300">
              {report.confidence}%
            </p>

            <p className="text-[9px] text-slate-600">
              Confidence
            </p>

          </div>

        )}

      </div>

    </button>

  );
}

/* ====================================================== */
/* SETTINGS TOGGLE */
/* ====================================================== */

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-black/20 p-4">

      <div className="min-w-0">

        <p className="text-xs font-medium text-slate-200">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-4 text-slate-600">
          {description}
        </p>

      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!enabled)
        }
        className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
          enabled
            ? "border-blue-400/30 bg-blue-500/70"
            : "border-white/10 bg-white/[0.05]"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}

/* ====================================================== */
/* HELPERS */
/* ====================================================== */

function formatDate(
  dateString
) {
  if (!dateString) {
    return "Unknown date";
  }

  return new Date(
    dateString
  ).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatStatus(
  status
) {
  if (!status) {
    return "Pending";
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

function getPercentage(
  value,
  total
) {
  if (!total) {
    return "0%";
  }

  return `${Math.round(
    (value / total) * 100
  )}%`;
}

function getInitials(
  name
) {
  if (!name) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map(
      (part) =>
        part[0]
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default Dashboard;