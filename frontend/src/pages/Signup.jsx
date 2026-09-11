import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import BackgroundFX from "../components/BackgroundFX";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Signup failed"
        );
      }

      /*
       * Store authentication information
       * returned by the backend.
       */
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      /*
       * New user is now authenticated.
       */
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
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

          {/* Signup Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-8 shadow-2xl backdrop-blur-2xl">

            <div className="mb-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                <LockKeyhole
                  size={18}
                  className="text-blue-400"
                />
              </div>

              <h1 className="text-3xl font-semibold tracking-tight">
                Enter the room.
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create your account and start making
                better decisions with multiple AI
                perspectives.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSignup}
              className="space-y-5"
            >

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Full name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-blue-500/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-blue-500/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-blue-500/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3.5 text-sm font-semibold transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}

              <Link
                to="/login"
                className="text-blue-400 transition hover:text-blue-300"
              >
                Log in
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

export default Signup;