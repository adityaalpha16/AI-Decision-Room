import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  BarChart3,
  FileText,
  Target,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import BackToDashboard from "../components/BackToDashboard";

function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/decisions/reports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load reports"
          );
        }

        setReports(data.reports || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white md:p-8">
      {/* Back to Dashboard */}
      <BackToDashboard />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5">
            <BarChart3
              size={22}
              className="text-blue-400"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              Decision Reports
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              AI-generated summaries of your analyzed decisions
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2
            size={22}
            className="mr-3 animate-spin"
          />
          Loading reports...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading &&
        !error &&
        reports.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">
            <FileText
              size={42}
              className="mx-auto mb-4 text-gray-500"
            />

            <h2 className="mb-2 text-xl font-semibold">
              No reports yet
            </h2>

            <p className="mb-6 text-gray-400">
              Analyze a decision and generate a final
              report to see it here.
            </p>

            <button
              onClick={() =>
                navigate("/new-decision")
              }
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-500"
            >
              Create Decision
            </button>
          </div>
        )}

      {/* Reports */}
      {!loading &&
        !error &&
        reports.length > 0 && (
          <div className="space-y-5">
            {reports.map((report) => (
              <div
                key={report.id}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-blue-500/30 hover:bg-white/[0.045]"
              >
                {/* Report Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                      <FileText
                        size={22}
                        className="text-blue-400"
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold transition group-hover:text-blue-400">
                        {report.decision_title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Report generated{" "}
                        {new Date(
                          report.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="flex items-center gap-2">
                    <Target
                      size={17}
                      className="text-blue-400"
                    />

                    <span className="text-sm text-gray-400">
                      Confidence
                    </span>

                    <span className="font-semibold text-blue-400">
                      {report.confidence}%
                    </span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      className="text-green-400"
                    />

                    <h3 className="text-sm font-semibold uppercase tracking-wide">
                      Final Recommendation
                    </h3>
                  </div>

                  <p className="leading-relaxed text-gray-300">
                    {report.final_recommendation}
                  </p>
                </div>

                {/* Risks + Opportunities */}
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Risks */}
                  <div className="rounded-xl border border-red-500/10 bg-red-500/[0.03] p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <AlertTriangle
                        size={18}
                        className="text-red-400"
                      />

                      <h3 className="text-sm font-semibold">
                        Key Risks
                      </h3>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-400">
                      {report.key_risks}
                    </p>
                  </div>

                  {/* Opportunities */}
                  <div className="rounded-xl border border-green-500/10 bg-green-500/[0.03] p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Lightbulb
                        size={18}
                        className="text-green-400"
                      />

                      <h3 className="text-sm font-semibold">
                        Key Opportunities
                      </h3>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-400">
                      {report.key_opportunities}
                    </p>
                  </div>
                </div>

                {/* View Decision */}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() =>
                      navigate(
                        `/decisions/${report.decision_id}`
                      )
                    }
                    className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                  >
                    View Decision Room
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default Reports;