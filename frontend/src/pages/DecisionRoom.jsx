import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Brain,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Sparkles,
  ShieldAlert,
  Target,
  Rocket,
  Lightbulb,
} from "lucide-react";
import AIFormattedText from "../components/AIFormattedText";

import BackToDashboard from "../components/BackToDashboard";
import AIReportPoints from "../components/AIReportPoints";

function DecisionRoom() {
  const { id } = useParams();

  const [decision, setDecision] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const agentIcons = {
    Analyst: Brain,
    Optimist: Rocket,
    Critic: ShieldAlert,
    Strategist: Target,
  };

  /* ---------------- Fetch Decision ---------------- */

  async function fetchDecision() {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/decisions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch decision"
        );
      }

      setDecision(data.decision);
      setAnalyses(data.analyses || []);
      setReport(data.report || null);
    } catch (err) {
      console.error("Fetch decision error:", err);

      setError(
        err.message || "Failed to load decision"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDecision();
  }, [id]);

  /* ---------------- Generate AI Analyses ---------------- */

  async function analyzeDecision() {
    if (analyzing || analyses.length >= 4) {
      return;
    }

    try {
      setAnalyzing(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/decisions/${id}/analyze`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate analyses"
        );
      }

      await fetchDecision();
    } catch (err) {
      console.error("Analysis error:", err);

      setError(
        err.message || "Failed to generate AI analyses"
      );

      await fetchDecision();
    } finally {
      setAnalyzing(false);
    }
  }

  /* ---------------- Generate Final Report ---------------- */

  async function generateReport() {
    if (
      generatingReport ||
      report ||
      analyses.length === 0
    ) {
      return;
    }

    try {
      setGeneratingReport(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/decisions/${id}/report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate report"
        );
      }

      await fetchDecision();
    } catch (err) {
      console.error("Report generation error:", err);

      setError(
        err.message || "Failed to generate final report"
      );

      await fetchDecision();
    } finally {
      setGeneratingReport(false);
    }
  }

  /* ---------------- Loading State ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="p-6 md:p-8">
          <BackToDashboard />

          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex items-center gap-3 text-gray-400">
              <Loader2
                size={24}
                className="animate-spin text-blue-400"
              />

              Loading Decision Room...
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Error State ---------------- */

  if (error && !decision) {
    return (
      <div className="min-h-screen bg-[#020617] p-6 text-white md:p-8">
        <BackToDashboard />

        <div className="mx-auto max-w-3xl rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle size={22} />

            <h2 className="font-semibold">
              Failed to load Decision Room
            </h2>
          </div>

          <p className="mt-3 text-sm text-gray-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!decision) {
    return null;
  }

  const analysisComplete = analyses.length >= 4;
  const reportReady = Boolean(report);

  const analysisFailed =
    decision.status === "failed";

  /* ---------------- Main UI ---------------- */

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white md:p-8">

      {/* Back to Dashboard */}
      <BackToDashboard />

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">

          <div className="mb-3 flex items-center gap-3">

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
              <Sparkles
                size={24}
                className="text-blue-400"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-blue-400">
                AI Decision Room
              </p>

              <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                {decision.title}
              </h1>
            </div>

          </div>

          <p className="max-w-3xl text-sm leading-relaxed text-gray-400">
            {decision.problem}
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-medium">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-400/80">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* Decision Details */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Problem */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

            <div className="mb-3 flex items-center gap-2">

              <FileText
                size={18}
                className="text-blue-400"
              />

              <h2 className="text-sm font-semibold">
                Decision Problem
              </h2>

            </div>

            <p className="text-sm leading-relaxed text-gray-400">
              {decision.problem}
            </p>

          </div>

          {/* Context */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

            <div className="mb-3 flex items-center gap-2">

              <Target
                size={18}
                className="text-blue-400"
              />

              <h2 className="text-sm font-semibold">
                Additional Context
              </h2>

            </div>

            <p className="text-sm leading-relaxed text-gray-400">
              {decision.context ||
                "No additional context provided."}
            </p>

          </div>

        </div>

        {/* Decision Lifecycle */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <div className="mb-6">

            <h2 className="text-lg font-semibold">
              Decision Lifecycle
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track the progress of your decision analysis.
            </p>

          </div>

          <div className="space-y-5">

            {/* Step 1 */}
            <div className="flex items-start gap-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/10">

                <CheckCircle2
                  size={19}
                  className="text-green-400"
                />

              </div>

              <div>

                <h3 className="text-sm font-semibold">
                  Step 1 — Decision Created
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Your decision has been successfully created.
                </p>

              </div>

            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  analysisComplete
                    ? "bg-green-500/10"
                    : analysisFailed
                    ? "bg-red-500/10"
                    : "bg-blue-500/10"
                }`}
              >

                {analysisComplete ? (
                  <CheckCircle2
                    size={19}
                    className="text-green-400"
                  />
                ) : analysisFailed ? (
                  <AlertCircle
                    size={19}
                    className="text-red-400"
                  />
                ) : analyzing ||
                  decision.status === "processing" ? (
                  <Loader2
                    size={19}
                    className="animate-spin text-blue-400"
                  />
                ) : (
                  <Brain
                    size={19}
                    className="text-blue-400"
                  />
                )}

              </div>

              <div>

                <h3 className="text-sm font-semibold">
                  Step 2 — AI Analysis
                </h3>

                <p className="mt-1 text-xs text-gray-500">

                  {analysisComplete
                    ? "All four AI agents have completed their analysis."
                    : analysisFailed
                    ? "The analysis failed. You can retry it."
                    : analyzing ||
                      decision.status === "processing"
                    ? "AI agents are analyzing your decision..."
                    : "Waiting for AI agents to analyze your decision."}

                </p>

              </div>

            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  reportReady
                    ? "bg-green-500/10"
                    : "bg-white/5"
                }`}
              >

                {reportReady ? (
                  <CheckCircle2
                    size={19}
                    className="text-green-400"
                  />
                ) : generatingReport ? (
                  <Loader2
                    size={19}
                    className="animate-spin text-blue-400"
                  />
                ) : (
                  <FileText
                    size={19}
                    className="text-gray-500"
                  />
                )}

              </div>

              <div>

                <h3 className="text-sm font-semibold">
                  Step 3 — Final Report
                </h3>

                <p className="mt-1 text-xs text-gray-500">

                  {reportReady
                    ? "Your final decision report is ready."
                    : generatingReport
                    ? "Generating the final AI report..."
                    : "Generate the final report after AI analysis is complete."}

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* AI Agents */}
        <div className="mb-8">

          <div className="mb-5">

            <h2 className="text-xl font-semibold">
              AI Agent Analysis
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Four different perspectives evaluate your decision.
            </p>

          </div>

          {analyses.length === 0 ? (

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-14 text-center">

              <Brain
                size={42}
                className="mx-auto mb-4 text-gray-600"
              />

              <h3 className="text-lg font-semibold">
                No AI analysis yet
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
                Start the analysis to let the four AI agents
                evaluate this decision from different perspectives.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {analyses.map((analysis) => {

                const Icon =
                  agentIcons[analysis.agent_name] ||
                  Brain;

                return (
                  <div
                    key={analysis.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-blue-500/20"
                  >

                    {/* Agent Header */}
                    <div className="mb-5 flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">

                          <Icon
                            size={21}
                            className="text-blue-400"
                          />

                        </div>

                        <div>

                          <h3 className="font-semibold">
                            {analysis.agent_name}
                          </h3>

                          <p className="text-xs text-gray-500">
                            {analysis.agent_role}
                          </p>

                        </div>

                      </div>

                      <span className="text-sm font-semibold text-blue-400">
                        {analysis.confidence}%
                      </span>

                    </div>

                    {/* Analysis */}
                    <div className="mb-5">

                      <AIFormattedText className="text-sm text-gray-400">
                        {analysis.analysis}
                      </AIFormattedText>

                    </div>

                    {/* Recommendation */}
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">

                      <p className="mb-2 text-xs uppercase tracking-wide text-gray-600">
                        Recommendation
                      </p>

                      <AIFormattedText className="text-sm font-medium text-gray-300">
                        {analysis.recommendation}
                      </AIFormattedText>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          {/* Analyze */}
          <button
            onClick={analyzeDecision}
            disabled={
              analyzing ||
              analysisComplete ||
              reportReady
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {analyzing ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Analyzing...
              </>
            ) : analysisComplete ? (
              <>
                <CheckCircle2 size={18} />

                Analysis Complete
              </>
            ) : analysisFailed ? (
              <>
                <AlertCircle size={18} />

                Retry Analysis
              </>
            ) : (
              <>
                <Brain size={18} />

                Analyze Decision
              </>
            )}

          </button>

          {/* Generate Report */}
          <button
            onClick={generateReport}
            disabled={
              generatingReport ||
              analyses.length === 0 ||
              reportReady
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-medium text-gray-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {generatingReport ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Generating Report...
              </>
            ) : reportReady ? (
              <>
                <CheckCircle2 size={18} />

                Report Generated
              </>
            ) : (
              <>
                <FileText size={18} />

                Generate Final Report
              </>
            )}

          </button>

        </div>

        {/* Final Report */}
        {report && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-6 md:p-8">

            {/* Report Header */}
            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">

                <FileText
                  size={22}
                  className="text-blue-400"
                />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Final Decision Report
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Synthesized from all four AI perspectives
                </p>

              </div>

            </div>

            {/* Final Recommendation */}
            {/* Recommendation */}
            <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/[0.03] p-5">

              <div className="mb-3 flex items-center gap-2">

                <CheckCircle2
                  size={19}
                  className="text-green-400"
                />

                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  Final Recommendation
                </h3>

              </div>

              <AIFormattedText className="text-sm leading-7 text-gray-300">
                {report.final_recommendation ||
                  report.recommendation ||
                  report.summary ||
                  "No final recommendation available."}
              </AIFormattedText>

            </div>

            {/* Confidence */}
            <div className="mb-5 rounded-xl border border-white/10 bg-black/20 p-5">

              <div className="mb-3 flex items-center justify-between">

                <span className="text-sm text-gray-400">
                  Overall Confidence
                </span>

                <span className="font-semibold text-blue-400">
                  {report.confidence}%
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/5">

                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        Number(report.confidence) || 0
                      )
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* Risks + Opportunities */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Key Risks */}
              <div className="rounded-xl border border-red-500/10 bg-red-500/[0.03] p-5">

                <div className="mb-3 flex items-center gap-2">

                  <ShieldAlert
                    size={19}
                    className="text-red-400"
                  />

                  <h3 className="font-semibold">
                    Key Risks
                  </h3>

                </div>

                <AIReportPoints
                  text={report.key_risks}
                  type="risk"
                />

              </div>

              {/* Key Opportunities */}
              <div className="rounded-xl border border-green-500/10 bg-green-500/[0.03] p-5">

                <div className="mb-3 flex items-center gap-2">

                  <Lightbulb
                    size={19}
                    className="text-green-400"
                  />

                  <h3 className="font-semibold">
                    Key Opportunities
                  </h3>

                </div>

                <AIReportPoints
                  text={report.key_opportunities}
                  type="opportunity"
                />

              </div>

            </div>

            {/* Next Steps */}
            {report.next_steps && (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-5">

                <h3 className="mb-3 font-semibold">
                  Next Steps
                </h3>

                <p className="text-sm leading-relaxed text-gray-400">
                  {report.next_steps}
                </p>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default DecisionRoom;