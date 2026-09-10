import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Lightbulb,
  Loader2,
  AlertCircle,
} from "lucide-react";

import BackgroundFX from "../components/BackgroundFX";
import BackToDashboard from "../components/BackToDashboard";

function NewDecision() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [context, setContext] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter a decision title.");
      return;
    }

    if (!problem.trim()) {
      setError("Please describe the problem or decision.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5001/api/decisions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            problem: problem.trim(),
            context: context.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create decision"
        );
      }

      navigate(`/decisions/${data.decision.id}`);
    } catch (err) {
      console.error("Create decision error:", err);
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* Background Effects */}
      <BackgroundFX />

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-8">

        {/* Back to Dashboard */}
        <BackToDashboard />

        {/* Header */}
        <div className="mx-auto mb-10 max-w-4xl">

          <div className="mb-4 flex items-center gap-3">

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
              <Sparkles
                size={24}
                className="text-blue-400"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Create New Decision
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Give the AI Decision Room the context it needs
                to evaluate your decision.
              </p>
            </div>

          </div>

        </div>

        {/* Form */}
        <div className="mx-auto max-w-4xl">

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl md:p-8"
          >

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">

                <AlertCircle size={20} />

                <span className="text-sm">
                  {error}
                </span>

              </div>
            )}

            {/* Decision Title */}
            <div className="mb-6">

              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Decision Title
              </label>

              <div className="relative">

                <FileText
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. Should I learn Spring Boot?"
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-black/30"
                  disabled={loading}
                />

              </div>

            </div>

            {/* Problem */}
            <div className="mb-6">

              <label
                htmlFor="problem"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                What are you trying to decide?
              </label>

              <textarea
                id="problem"
                value={problem}
                onChange={(e) =>
                  setProblem(e.target.value)
                }
                placeholder="Describe the decision or problem you want the AI agents to analyze..."
                rows={6}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-black/30"
                disabled={loading}
              />

            </div>

            {/* Context */}
            <div className="mb-8">

              <label
                htmlFor="context"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300"
              >
                <Lightbulb
                  size={17}
                  className="text-blue-400"
                />

                Additional Context
                <span className="text-xs text-gray-600">
                  Optional
                </span>
              </label>

              <textarea
                id="context"
                value={context}
                onChange={(e) =>
                  setContext(e.target.value)
                }
                placeholder="Add relevant information, constraints, goals, timeline, budget, experience, etc."
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-black/30"
                disabled={loading}
              />

            </div>

            {/* Submit */}
            <div className="flex justify-end">

              <button
                type="submit"
                disabled={loading}
                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Creating Decision...
                  </>
                ) : (
                  <>
                    Create Decision Room

                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

            </div>

          </form>

          {/* AI Agents Information */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">

            <div className="flex items-start gap-3">

              <div className="rounded-lg bg-blue-500/10 p-2">

                <Sparkles
                  size={18}
                  className="text-blue-400"
                />

              </div>

              <div>

                <h3 className="text-sm font-semibold text-gray-200">
                  What happens next?
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Your decision will be evaluated by four AI
                  agents with different perspectives: Analyst,
                  Optimist, Critic, and Strategist.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default NewDecision;