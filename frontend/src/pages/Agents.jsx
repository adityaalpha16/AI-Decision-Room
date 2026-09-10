import {
  Brain,
  Rocket,
  ShieldAlert,
  Target,
  Sparkles,
} from "lucide-react";

import BackToDashboard from "../components/BackToDashboard";

const agents = [
  {
    name: "Analyst",
    role: "Logical & Data-Driven",
    icon: Brain,
    description:
      "Breaks the decision into facts, evidence, assumptions, and measurable outcomes.",
    focus: [
      "Facts & evidence",
      "Objective evaluation",
      "Pros and cons",
      "Data-driven reasoning",
    ],
  },
  {
    name: "Optimist",
    role: "Opportunity & Growth",
    icon: Rocket,
    description:
      "Looks for opportunities, potential benefits, and the positive outcomes that could come from the decision.",
    focus: [
      "Growth opportunities",
      "Potential upside",
      "Best-case outcomes",
      "Innovation",
    ],
  },
  {
    name: "Critic",
    role: "Risk & Failure",
    icon: ShieldAlert,
    description:
      "Challenges the decision by identifying weaknesses, risks, hidden assumptions, and possible failure scenarios.",
    focus: [
      "Risks",
      "Weaknesses",
      "Failure scenarios",
      "Hidden assumptions",
    ],
  },
  {
    name: "Strategist",
    role: "Long-Term Strategy",
    icon: Target,
    description:
      "Looks beyond the immediate decision and evaluates its long-term impact, trade-offs, and strategic value.",
    focus: [
      "Long-term impact",
      "Strategic alignment",
      "Trade-offs",
      "Action planning",
    ],
  },
];

function Agents() {
  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white md:p-8">

      {/* Back to Dashboard */}
      <BackToDashboard />

      {/* Header */}
      <div className="mb-10">

        <div className="mb-3 flex items-center gap-3">

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5">
            <Sparkles
              size={22}
              className="text-blue-400"
            />
          </div>

          <h1 className="text-2xl font-bold md:text-3xl">
            AI Agents
          </h1>

        </div>

        <p className="max-w-2xl text-gray-400">
          Four specialized AI perspectives analyze
          every decision from different angles before
          the Decision Room creates a final report.
        </p>

      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {agents.map((agent) => {
          const Icon = agent.icon;

          return (
            <div
              key={agent.name}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-blue-500/30 hover:bg-white/[0.05]"
            >

              {/* Icon + Name */}
              <div className="mb-5 flex items-center gap-4">

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                  <Icon
                    size={26}
                    className="text-blue-400"
                  />
                </div>

                <div>

                  <h2 className="text-xl font-semibold transition group-hover:text-blue-400">
                    {agent.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {agent.role}
                  </p>

                </div>

              </div>

              {/* Description */}
              <p className="mb-6 leading-relaxed text-gray-400">
                {agent.description}
              </p>

              {/* Focus Areas */}
              <div>

                <p className="mb-3 text-xs uppercase tracking-wider text-gray-500">
                  Focus Areas
                </p>

                <div className="flex flex-wrap gap-2">

                  {agent.focus.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-gray-300"
                    >
                      {item}
                    </span>
                  ))}

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default Agents;