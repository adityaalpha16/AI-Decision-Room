import { useState } from "react";
import { ArrowLeft, ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import BackgroundFX from "../components/BackgroundFX";

function Login() {
    const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <BackgroundFX mouse={{ x: 50, y: 50 }} />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Back */}
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
              <Sparkles size={19} className="text-blue-400" />
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

          {/* Login Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-8 shadow-2xl backdrop-blur-2xl">

            <div className="mb-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                <LockKeyhole size={18} className="text-blue-400" />
              </div>

              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome back.
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter the room and continue making better decisions.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-blue-500/[0.04]"
                  />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-slate-300">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-blue-400 transition hover:text-blue-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-blue-500/[0.04]"
                />
              </div>
              {error && (
  <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
    {error}
  </p>
)}

             <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3.5 text-sm font-semibold transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                {loading ? "Entering..." : "Enter Decision Room"}

                <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

            </form>

            {/* Signup */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 transition hover:text-blue-300"
              >
                Create one
              </Link>
            </p>

          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Your decisions stay private and secure.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
