import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import BackgroundFX from "../components/BackgroundFX";

function Landing() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const handleMouseMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;

    setMouse({ x, y });
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#020617] text-white"
      onMouseMove={handleMouseMove}
    >
      <BackgroundFX mouse={mouse} />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#020617]/70 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 transition duration-300 group-hover:border-blue-400/40 group-hover:bg-blue-500/15">
              <div className="absolute inset-0 rounded-xl bg-blue-500/10 blur-xl opacity-0 transition duration-300 group-hover:opacity-100" />

              <Sparkles
                size={19}
                className="relative text-blue-400"
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
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
            <a
              href="#how-it-works"
              className="transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#agents"
              className="transition hover:text-white"
            >
              AI Agents
            </a>
          </div>

          {/* Authentication */}
          <div className="flex items-center gap-2 sm:gap-3">

            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white sm:block"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition duration-300 hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-blue-200"
            >
              Get started
            </Link>

          </div>

        </nav>
      </header>

      {/* Main */}
      <main className="relative z-10">

        {/* ====================================================== */}
        {/* HERO */}
        {/* ====================================================== */}

        <section className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col items-center justify-center px-5 py-20 text-center sm:px-6 lg:px-8">

          {/* Ambient glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.06] blur-[130px]" />

          {/* Badge */}
          <div className="page-enter relative mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.06] px-4 py-2 text-[10px] font-medium tracking-[0.18em] text-blue-300 backdrop-blur-xl sm:text-xs">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
            </span>

            MULTI-AGENT DECISION INTELLIGENCE

          </div>

          {/* Heading */}
          <h1 className="page-enter relative max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[86px]">

            Stop making

            <br />

            <span className="text-glow bg-gradient-to-r from-blue-300 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              important decisions
            </span>

            <br />

            <span className="text-white">
              alone.
            </span>

          </h1>

          {/* Description */}
          <p className="page-enter relative mt-8 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 lg:text-lg">
            AI Decision Room brings multiple specialized AI perspectives
            together to analyze your choices, evaluate options, uncover risks,
            and help you make more informed decisions.
          </p>

          {/* CTA */}
          <div className="page-enter relative mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">

            <Link
              to="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(59,130,246,0.18)] transition duration-300 hover:bg-blue-400 hover:shadow-[0_0_65px_rgba(59,130,246,0.3)]"
            >
              Enter the Decision Room

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#how-it-works"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm text-slate-300 backdrop-blur-xl transition duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              See how it works

              <ChevronDown
                size={15}
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </a>

          </div>

          {/* ====================================================== */}
          {/* AGENT PREVIEW */}
          {/* ====================================================== */}

          <div className="relative mt-24 w-full max-w-5xl sm:mt-28">

            {/* Glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.08] blur-[110px]" />

            <div className="relative grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">

              {/* Agent 1 */}
              <div className="glass-panel glass-panel-hover group rounded-2xl p-4 text-left sm:p-5">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition duration-300 group-hover:scale-105 group-hover:bg-blue-500/15">
                  ✦
                </div>

                <h3 className="text-sm font-semibold">
                  Strategic Analyst
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Evaluates long-term opportunities, growth, and future consequences.
                </p>

              </div>

              {/* Agent 2 */}
              <div className="glass-panel glass-panel-hover group rounded-2xl p-4 text-left sm:p-5">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition duration-300 group-hover:scale-105 group-hover:bg-blue-500/15">
                  ◈
                </div>

                <h3 className="text-sm font-semibold">
                  Practical Analyst
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Evaluates cost, time, feasibility, resources, and practical constraints.
                </p>

              </div>

              {/* Agent 3 */}
              <div className="glass-panel glass-panel-hover group rounded-2xl p-4 text-left sm:p-5">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition duration-300 group-hover:scale-105 group-hover:bg-blue-500/15">
                  ◎
                </div>

                <h3 className="text-sm font-semibold">
                  Risk Analyst
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Finds hidden risks, failure scenarios, and weak assumptions.
                </p>

              </div>

              {/* Agent 4 */}
              <div className="glass-panel glass-panel-hover group rounded-2xl p-4 text-left sm:p-5">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition duration-300 group-hover:scale-105 group-hover:bg-blue-500/15">
                  ⚡
                </div>

                <h3 className="text-sm font-semibold">
                  Goal Advisor
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Evaluates how each option aligns with your goals and priorities.
                </p>

              </div>

            </div>

            {/* Connection Lines */}
            <div className="pointer-events-none absolute left-1/2 top-full hidden h-16 w-[80%] -translate-x-1/2 md:block">

              <div className="absolute left-[12.5%] top-0 h-full w-px bg-gradient-to-b from-blue-400/40 to-transparent" />

              <div className="absolute left-[37.5%] top-0 h-full w-px bg-gradient-to-b from-blue-400/40 to-transparent" />

              <div className="absolute left-[62.5%] top-0 h-full w-px bg-gradient-to-b from-blue-400/40 to-transparent" />

              <div className="absolute left-[87.5%] top-0 h-full w-px bg-gradient-to-b from-blue-400/40 to-transparent" />

              <div className="absolute bottom-0 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

            </div>

            {/* Judge */}
            <div className="relative mx-auto mt-6 w-fit">

              <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-2xl" />

              <div className="pulse-glow relative flex items-center gap-3 rounded-2xl border border-blue-400/30 bg-blue-500/[0.08] px-6 py-4 backdrop-blur-2xl sm:px-7">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                  ◉
                </div>

                <div className="text-left">

                  <p className="text-[9px] tracking-[0.25em] text-blue-400 sm:text-[10px]">
                    SYNTHESIS ENGINE
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    AI Judge
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ====================================================== */}
        {/* HOW IT WORKS */}
        {/* ====================================================== */}

        <section
          id="how-it-works"
          className="border-t border-white/[0.06] px-5 py-28 sm:px-6 sm:py-32 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-[10px] font-medium tracking-[0.3em] text-blue-400 sm:text-xs">
                THE DECISION PROCESS
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                From uncertainty to clarity.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                Give the room a problem. Let specialized AI perspectives
                analyze it independently, evaluate the important factors, and
                synthesize the strongest conclusion.
              </p>

            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">

              {[
                {
                  number: "01",
                  label: "DEFINE",
                  title: "Define the decision",
                  description:
                    "Describe the situation, available options, constraints, goals, and what matters most to you.",
                },
                {
                  number: "02",
                  label: "ANALYZE",
                  title: "Get multiple perspectives",
                  description:
                    "Four specialized AI agents examine the decision independently from strategic, practical, risk, and goal-oriented perspectives.",
                },
                {
                  number: "03",
                  label: "SYNTHESIZE",
                  title: "Receive the synthesis",
                  description:
                    "The AI Judge compares the perspectives and produces a structured recommendation with reasoning, risks, and confidence.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="glass-panel glass-panel-hover group relative overflow-hidden rounded-3xl p-7"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-xs tracking-[0.25em] text-blue-400">
                      {step.number}
                    </span>

                    <span className="text-[10px] tracking-[0.25em] text-slate-600">
                      {step.label}
                    </span>

                  </div>

                  <h3 className="mt-12 text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>

                  <div className="mt-8 h-px w-full bg-gradient-to-r from-blue-500/40 to-transparent" />

                </div>
              ))}

            </div>

          </div>
        </section>

        {/* ====================================================== */}
        {/* AI AGENTS */}
        {/* ====================================================== */}

        <section
          id="agents"
          className="border-t border-white/[0.06] px-5 py-28 sm:px-6 sm:py-32 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">

            <div className="max-w-2xl">

              <p className="text-[10px] font-medium tracking-[0.3em] text-blue-400 sm:text-xs">
                INSIDE THE ROOM
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Every perspective has a purpose.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                Each agent is designed to approach your decision with a
                different objective. Together, they create a broader view
                than a single perspective could provide.
              </p>

            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 md:gap-5">

              {[
                {
                  icon: "✦",
                  number: "AGENT 01",
                  title: "Strategic Analyst",
                  description:
                    "Looks beyond the immediate choice and evaluates long-term opportunities, growth, goals, trade-offs, and potential outcomes.",
                  focus: "LONG-TERM VALUE",
                },
                {
                  icon: "◈",
                  number: "AGENT 02",
                  title: "Practical Analyst",
                  description:
                    "Evaluates cost, time, resources, feasibility, ROI, and practical constraints that affect the decision.",
                  focus: "PRACTICAL FEASIBILITY",
                },
                {
                  icon: "◎",
                  number: "AGENT 03",
                  title: "Risk Analyst",
                  description:
                    "Searches for hidden risks, weak assumptions, failure scenarios, and consequences that may be easy to overlook.",
                  focus: "RISK EXPOSURE",
                },
                {
                  icon: "⚡",
                  number: "AGENT 04",
                  title: "Goal Advisor",
                  description:
                    "Evaluates how the available options align with your goals, priorities, and the outcomes you care about most.",
                  focus: "GOAL ALIGNMENT",
                },
              ].map((agent) => (
                <div
                  key={agent.number}
                  className="glass-panel glass-panel-hover group rounded-3xl p-7"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xl text-blue-300 transition duration-300 group-hover:scale-105 group-hover:bg-blue-500/15">
                      {agent.icon}
                    </div>

                    <span className="text-[10px] tracking-[0.2em] text-slate-600">
                      {agent.number}
                    </span>

                  </div>

                  <h3 className="mt-8 text-xl font-semibold">
                    {agent.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {agent.description}
                  </p>

                  <div className="mt-6 text-[10px] font-medium tracking-[0.2em] text-blue-400">
                    FOCUS → {agent.focus}
                  </div>

                </div>
              ))}

            </div>

          </div>
        </section>

        {/* ====================================================== */}
        {/* FINAL CTA */}
        {/* ====================================================== */}

        <section className="border-t border-white/[0.06] px-5 py-28 sm:px-6 sm:py-32 lg:px-8">

          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-blue-500/15 bg-blue-500/[0.035] px-6 py-14 text-center sm:px-10">

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.08] blur-[90px]" />

            <div className="relative">

              <Sparkles
                size={24}
                className="mx-auto text-blue-400"
              />

              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Your next decision deserves
                <span className="text-blue-400">
                  {" "}more perspectives.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Bring your next important decision into the room and
                see what multiple AI perspectives can uncover.
              </p>

              <Link
                to="/signup"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold shadow-[0_0_40px_rgba(59,130,246,0.18)] transition duration-300 hover:bg-blue-400 hover:shadow-[0_0_60px_rgba(59,130,246,0.28)]"
              >
                Enter the Decision Room

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-6 lg:px-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

          <div className="flex items-center gap-2">

            <Sparkles
              size={14}
              className="text-blue-400"
            />

            <span className="text-xs text-slate-500">
              AI Decision Room
            </span>

          </div>

          <p className="text-xs text-slate-600">
            Multi-agent intelligence for better decisions.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Landing;