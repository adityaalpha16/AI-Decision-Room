import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  ArrowLeft,
  GitCompare,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Brain,
  Trophy,
} from "lucide-react";

import BackToDashboard from "../components/BackToDashboard";

function DecisionComparison() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const firstId = searchParams.get("first");
  const secondId = searchParams.get("second");

  const [decisions, setDecisions] = useState([]);
  const [reports, setReports] = useState([]);

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

        if (!firstId || !secondId) {
          throw new Error(
            "Two decisions are required for comparison."
          );
        }

        if (Number(firstId) === Number(secondId)) {
          throw new Error(
            "Please select two different decisions to compare."
          );
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [decisionsResponse, reportsResponse] =
          await Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/api/decisions`, {
              headers,
            }),

            fetch(`${import.meta.env.VITE_API_URL}/api/decisions/reports`, {
              headers,
            }),
          ]);

        const decisionsData =
          await decisionsResponse.json();

        const reportsData =
          await reportsResponse.json();

        if (!decisionsResponse.ok) {
          throw new Error(
            decisionsData.message ||
              "Failed to load decisions."
          );
        }

        if (!reportsResponse.ok) {
          throw new Error(
            reportsData.message ||
              "Failed to load reports."
          );
        }

        setDecisions(
          decisionsData.decisions || []
        );

        setReports(
          reportsData.reports ||
            reportsData.data?.reports ||
            []
        );
      } catch (err) {
        console.error(
          "Comparison fetch error:",
          err
        );

        setError(
          err.message ||
            "Something went wrong while loading the comparison."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, firstId, secondId]);

  const firstDecision = decisions.find(
    (decision) =>
      Number(decision.id) === Number(firstId)
  );

  const secondDecision = decisions.find(
    (decision) =>
      Number(decision.id) === Number(secondId)
  );

  const firstReport = reports.find(
    (report) =>
      Number(report.decision_id) === Number(firstId)
  );

  const secondReport = reports.find(
    (report) =>
      Number(report.decision_id) === Number(secondId)
  );

  function getRecommendation(report) {
    if (!report) {
      return "No final report available.";
    }

    return (
      report.final_recommendation ||
      "No final recommendation available."
    );
  }

  function getScore(report) {
    if (!report) {
      return null;
    }

    if (
      report.confidence !== null &&
      report.confidence !== undefined
    ) {
      return Number(report.confidence);
    }

    return null;
  }

  function formatScore(report) {
    const score = getScore(report);

    if (score === null) {
      return "N/A";
    }

    return `${score}/100`;
  }

  function openDecision(id) {
    navigate(`/decisions/${id}`);
  }

  /*
   * Suggested Final Decision
   *
   * The decision with the higher final AI confidence
   * is selected as the suggested decision.
   */
  let suggestedDecision = null;
  let suggestedReport = null;
  let suggestedScore = null;

  const firstScore = getScore(firstReport);
  const secondScore = getScore(secondReport);

  if (firstScore !== null && secondScore !== null) {
    if (firstScore >= secondScore) {
      suggestedDecision = firstDecision;
      suggestedReport = firstReport;
      suggestedScore = firstScore;
    } else {
      suggestedDecision = secondDecision;
      suggestedReport = secondReport;
      suggestedScore = secondScore;
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white md:p-8">

      <BackToDashboard />

      {/* Header */}
      <div className="mb-8">

        <div className="mb-3 flex items-center gap-3">

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5">
            <GitCompare
              size={22}
              className="text-blue-400"
            />
          </div>

          <div>

            <h1 className="text-2xl font-bold md:text-3xl">
              Decision Comparison
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Compare two AI Decision Room sessions
              side by side.
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

          Loading comparison...

        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

          <div className="flex items-center gap-3 text-red-400">

            <AlertCircle size={20} />

            <span>{error}</span>

          </div>

          <button
            onClick={() => navigate("/decisions")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
          >
            <ArrowLeft size={16} />
            Back to Decisions
          </button>

        </div>
      )}

      {/* Invalid Decisions */}
      {!loading &&
        !error &&
        (!firstDecision || !secondDecision) && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">

            <div className="flex items-center gap-3 text-yellow-400">

              <AlertCircle size={20} />

              <span>
                One or both selected decisions could
                not be found.
              </span>

            </div>

            <button
              onClick={() => navigate("/decisions")}
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
            >
              <ArrowLeft size={16} />
              Back to Decisions
            </button>

          </div>
        )}

      {/* Comparison */}
      {!loading &&
        !error &&
        firstDecision &&
        secondDecision && (
          <div>

            {/* Comparison Intro */}
            <div className="mb-6 rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-5">

              <div className="flex items-start gap-3">

                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">

                  <Sparkles
                    size={18}
                    className="text-blue-400"
                  />

                </div>

                <div>

                  <h2 className="font-semibold">
                    Side-by-Side Analysis
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Review the final AI recommendations,
                    confidence levels, and context of both
                    decisions.
                  </p>

                </div>

              </div>

            </div>

            {/* Two Decision Columns */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* FIRST DECISION */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div className="mb-6 flex items-start justify-between gap-4">

                  <div>

                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-blue-400">
                      Decision 1
                    </p>

                    <h2 className="text-xl font-semibold">
                      {firstDecision.title}
                    </h2>

                    <p className="mt-1 text-xs text-gray-600">
                      Created{" "}
                      {new Date(
                        firstDecision.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-green-400"
                  />

                </div>

                {/* Problem */}
                <div className="mb-5 rounded-xl border border-white/10 bg-black/20 p-4">

                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-600">
                    Decision Problem
                  </p>

                  <p className="text-sm leading-relaxed text-gray-400">
                    {firstDecision.problem}
                  </p>

                </div>

                {/* Context */}
                {firstDecision.context && (
                  <div className="mb-5">

                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-600">
                      Context
                    </p>

                    <p className="text-sm leading-relaxed text-gray-500">
                      {firstDecision.context}
                    </p>

                  </div>
                )}

                {/* Recommendation */}
                <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.03] p-4">

                  <div className="mb-3 flex items-center gap-2">

                    <Brain
                      size={17}
                      className="text-blue-400"
                    />

                    <p className="text-xs font-medium uppercase tracking-wide text-blue-400">
                      AI Recommendation
                    </p>

                  </div>

                  <p className="text-sm leading-relaxed text-gray-300">
                    {getRecommendation(firstReport)}
                  </p>

                </div>

                {/* Score */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">

                  <div>

                    <p className="text-sm text-gray-500">
                      Overall Score
                    </p>

                    {firstReport && (
                      <p className="mt-1 text-xs text-gray-600">
                        Final AI confidence
                      </p>
                    )}

                  </div>

                  <span className="text-lg font-semibold text-blue-400">
                    {formatScore(firstReport)}
                  </span>

                </div>

                {/* Open Decision */}
                <button
                  onClick={() =>
                    openDecision(firstDecision.id)
                  }
                  className="mt-5 flex w-full items-center justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                >
                  Open Decision Room
                </button>

              </div>

              {/* SECOND DECISION */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div className="mb-6 flex items-start justify-between gap-4">

                  <div>

                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-purple-400">
                      Decision 2
                    </p>

                    <h2 className="text-xl font-semibold">
                      {secondDecision.title}
                    </h2>

                    <p className="mt-1 text-xs text-gray-600">
                      Created{" "}
                      {new Date(
                        secondDecision.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-green-400"
                  />

                </div>

                {/* Problem */}
                <div className="mb-5 rounded-xl border border-white/10 bg-black/20 p-4">

                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-600">
                    Decision Problem
                  </p>

                  <p className="text-sm leading-relaxed text-gray-400">
                    {secondDecision.problem}
                  </p>

                </div>

                {/* Context */}
                {secondDecision.context && (
                  <div className="mb-5">

                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-600">
                      Context
                    </p>

                    <p className="text-sm leading-relaxed text-gray-500">
                      {secondDecision.context}
                    </p>

                  </div>
                )}

                {/* Recommendation */}
                <div className="rounded-xl border border-purple-500/10 bg-purple-500/[0.03] p-4">

                  <div className="mb-3 flex items-center gap-2">

                    <Brain
                      size={17}
                      className="text-purple-400"
                    />

                    <p className="text-xs font-medium uppercase tracking-wide text-purple-400">
                      AI Recommendation
                    </p>

                  </div>

                  <p className="text-sm leading-relaxed text-gray-300">
                    {getRecommendation(secondReport)}
                  </p>

                </div>

                {/* Score */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">

                  <div>

                    <p className="text-sm text-gray-500">
                      Overall Score
                    </p>

                    {secondReport && (
                      <p className="mt-1 text-xs text-gray-600">
                        Final AI confidence
                      </p>
                    )}

                  </div>

                  <span className="text-lg font-semibold text-purple-400">
                    {formatScore(secondReport)}
                  </span>

                </div>

                {/* Open Decision */}
                <button
                  onClick={() =>
                    openDecision(secondDecision.id)
                  }
                  className="mt-5 flex w-full items-center justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-400"
                >
                  Open Decision Room
                </button>

              </div>

            </div>

            {/* ================================================= */}
            {/* SUGGESTED FINAL DECISION */}
            {/* ================================================= */}

            {suggestedDecision && suggestedReport && (
              <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-6">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-start gap-4">

                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3">

                      <Trophy
                        size={24}
                        className="text-green-400"
                      />

                    </div>

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wide text-green-400">
                        Suggested Final Decision
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        {suggestedDecision.title}
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
                        This decision has the higher final AI
                        confidence score and is therefore
                        suggested as the stronger option.
                      </p>

                    </div>

                  </div>

                  <div className="shrink-0 text-left md:text-right">

                    <p className="text-xs uppercase tracking-wide text-gray-600">
                      Final AI Confidence
                    </p>

                    <p className="mt-1 text-3xl font-bold text-green-400">
                      {suggestedScore}/100
                    </p>

                  </div>

                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">

                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-600">
                    Final Recommendation
                  </p>

                  <p className="text-sm leading-relaxed text-gray-300">
                    {getRecommendation(suggestedReport)}
                  </p>

                </div>

              </div>
            )}

            {/* Bottom Navigation */}
            <div className="mt-8 flex justify-center">

              <button
                onClick={() => navigate("/decisions")}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm text-gray-400 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <ArrowLeft size={16} />
                Back to All Decisions
              </button>

            </div>

          </div>
        )}

    </div>
  );
}

export default DecisionComparison;