import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cyan-50 via-amber-50 to-rose-50 px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl animate-pulse" />
        <div className="absolute right-8 top-28 h-72 w-72 rounded-full bg-rose-300/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_35px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        <div className="relative p-8 sm:p-10">
          <div className="absolute inset-x-6 -top-4 h-10 rounded-full bg-gradient-to-r from-cyan-500/20 via-rose-500/20 to-amber-500/20 blur-2xl" />

          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              Create Account
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Join the care platform
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Set up your profile to get started.
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">First name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Jane"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
              <select
                name="role"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                defaultValue="customer"
              >
                <option value="admin">Admin</option>
                <option value="customer">Customer / Patient</option>
                <option value="doctor">Doctor / Nutritionist</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-slate-600">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300" />
              I agree to the terms and privacy policy.
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Create account
              </button>
              <button
                type="reset"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:bg-amber-50"
              >
                Clear
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <button
              className="font-semibold text-slate-900 hover:underline"
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;