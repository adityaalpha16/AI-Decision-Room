import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock3,
  XCircle,
  Sparkles,
  GitCompare,
  Check,
} from "lucide-react";

import BackToDashboard from "../components/BackToDashboard";

function Decisions() {
  const navigate = useNavigate();

  const [decisions, setDecisions] = useState([]);
  const [reports, setReports] = useState([]);

  const [selectedDecisions, setSelectedDecisions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [decisionsResponse, reportsResponse] = await Promise.all([
          fetch("http://localhost:5001/api/decisions", {
            headers,
          }),

          fetch("http://localhost:5001/api/decisions/reports", {
            headers,
          }),
        ]);

        const decisionsData = await decisionsResponse.json();
        const reportsData = await reportsResponse.json();

        if (!decisionsResponse.ok) {
          throw new Error(
            decisionsData.message || "Failed to load decisions"
          );
        }

        if (!reportsResponse.ok) {
          throw new Error(
            reportsData.message || "Failed to load reports"
          );
        }

        setDecisions(decisionsData.decisions || []);

        /*
          The reports endpoint returns the user's reports.
          We keep this flexible in case the response property
          is named differently.
        */
        setReports(
          reportsData.reports ||
            reportsData.data?.reports ||
            []
        );
      } catch (err) {
        console.error("Fetch decisions error:", err);

        setError(
          err.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  function getReportForDecision(decisionId) {
    return reports.find(
      (report) => Number(report.decision_id) === Number(decisionId)
    );
  }

  function hasReport(decisionId) {
    return Boolean(getReportForDecision(decisionId));
  }

  function toggleDecision(decision) {
    if (decision.status !== "completed") {
      return;
    }

    if (!hasReport(decision.id)) {
      return;
    }

    setSelectedDecisions((current) => {
      const alreadySelected = current.includes(decision.id);

      if (alreadySelected) {
        return current.filter((id) => id !== decision.id);
      }

      if (current.length >= 2) {
        return current;
      }

      return [...current, decision.id];
    });
  }

  function clearSelection() {
    setSelectedDecisions([]);
  }

  function compareSelected() {
    if (selectedDecisions.length !== 2) {
      return;
    }

    const first = selectedDecisions[0];
    const second = selectedDecisions[1];

    navigate(
      `/decisions/compare?first=${first}&second=${second}`
    );
  }

  function getStatusIcon(status) {
    switch (status) {
      case "completed":
        return (
          <CheckCircle2
            size={16}
            className="text-green-400"
          />
        );

      case "processing":
        return (
          <Loader2
            size={16}
            className="animate-spin text-blue-400"
          />
        );

      case "failed":
        return (
          <XCircle
            size={16}
            className="text-red-400"
          />
        );

      case "pending":
      default:
        return (
          <Clock3
            size={16}
            className="text-yellow-400"
          />
        );
    }
  }

  function getStatusText(status) {
    switch (status) {
      case "completed":
        return "Completed";

      case "processing":
        return "Processing";

      case "failed":
        return "Failed";

      case "pending":
      default:
        return "Pending";
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "completed":
        return "border-green-500/20 bg-green-500/5 text-green-400";

      case "processing":
        return "border-blue-500/20 bg-blue-500/5 text-blue-400";

      case "failed":
        return "border-red-500/20 bg-red-500/5 text-red-400";

      case "pending":
      default:
        return "border-yellow-500/20 bg-yellow-500/5 text-yellow-400";
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white md:p-8">

      <BackToDashboard />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5">
            <FileText
              size={22}
              className="text-blue-400"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              My Decisions
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and manage all your AI Decision Room sessions
            </p>
          </div>

        </div>
      </div>

      {/* Comparison Toolbar */}
      {!loading &&
        !error &&
        decisions.length > 0 && (
          <div className="mb-6 rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-4">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-start gap-3">

                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
                  <GitCompare
                    size={19}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Compare Decisions
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Select two completed decisions with final reports
                    to compare their AI recommendations.
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-2">

                {selectedDecisions.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:border-white/20 hover:text-white"
                  >
                    Clear
                  </button>
                )}

                <button
                  onClick={compareSelected}
                  disabled={selectedDecisions.length !== 2}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    selectedDecisions.length === 2
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "cursor-not-allowed bg-white/5 text-gray-600"
                  }`}
                >
                  <GitCompare size={16} />
                  Compare Selected
                </button>

              </div>

            </div>

            {selectedDecisions.length > 0 && (
              <div className="mt-3 text-xs text-blue-400">
                {selectedDecisions.length} of 2 decisions selected
              </div>
            )}

          </div>
        )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2
            size={22}
            className="mr-3 animate-spin"
          />
          Loading decisions...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        decisions.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">

            <FileText
              size={42}
              className="mx-auto mb-4 text-gray-500"
            />

            <h2 className="mb-2 text-xl font-semibold">
              No decisions yet
            </h2>

            <p className="mb-6 text-gray-400">
              Create your first decision and let the AI agents
              evaluate it from multiple perspectives.
            </p>

            <button
              onClick={() => navigate("/new-decision")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500"
            >
              <Sparkles size={17} />
              Create Decision
              <ArrowRight size={16} />
            </button>

          </div>
        )}

      {/* Decisions */}
      {!loading &&
        !error &&
        decisions.length > 0 && (
          <div className="space-y-4">

            {decisions.map((decision) => {
              const report = getReportForDecision(decision.id);

              const canCompare =
                decision.status === "completed" &&
                Boolean(report);

              const isSelected =
                selectedDecisions.includes(decision.id);

              return (
                <div
                  key={decision.id}
                  className={`group rounded-2xl border p-5 transition-all md:p-6 ${
                    isSelected
                      ? "border-blue-500/40 bg-blue-500/[0.06]"
                      : "border-white/10 bg-white/[0.03] hover:border-blue-500/30 hover:bg-white/[0.045]"
                  }`}
                >

                  {/* Decision Header */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div className="flex items-start gap-4">

                      {/* Selection */}
                      <button
                        type="button"
                        disabled={!canCompare}
                        onClick={() => toggleDecision(decision)}
                        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                          !canCompare
                            ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-gray-700"
                            : isSelected
                            ? "border-blue-500 bg-blue-600 text-white"
                            : "border-white/15 bg-white/[0.02] text-transparent hover:border-blue-500/50"
                        }`}
                        title={
                          !canCompare
                            ? "A completed final report is required for comparison"
                            : isSelected
                            ? "Remove from comparison"
                            : "Select for comparison"
                        }
                      >
                        {isSelected && <Check size={16} />}
                      </button>

                      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                        <FileText
                          size={21}
                          className="text-blue-400"
                        />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold transition group-hover:text-blue-400">
                          {decision.title}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          Created{" "}
                          {new Date(
                            decision.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                    </div>

                    {/* Status */}
                    <div
                      className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClass(
                        decision.status
                      )}`}
                    >
                      {getStatusIcon(decision.status)}
                      {getStatusText(decision.status)}
                    </div>

                  </div>

                  {/* Comparison Status */}
                  {decision.status === "completed" && (
                    <div className="mt-4 flex items-center gap-2 text-xs">
                      {report ? (
                        <>
                          <CheckCircle2
                            size={14}
                            className="text-green-400"
                          />
                          <span className="text-green-400">
                            Final report available for comparison
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle
                            size={14}
                            className="text-yellow-400"
                          />
                          <span className="text-yellow-400">
                            Final report not available
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Problem */}
                  <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">

                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                      Decision Problem
                    </p>

                    <p className="text-sm leading-relaxed text-gray-400">
                      {decision.problem}
                    </p>

                  </div>

                  {/* Context */}
                  {decision.context && (
                    <div className="mt-4">

                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                        Context
                      </p>

                      <p className="text-sm leading-relaxed text-gray-500">
                        {decision.context}
                      </p>

                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-5 flex justify-end">

                    <button
                      onClick={() =>
                        navigate(
                          `/decisions/${decision.id}`
                        )
                      }
                      className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      Open Decision Room
                      <ArrowRight size={16} />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

    </div>
  );
}

export default Decisions;