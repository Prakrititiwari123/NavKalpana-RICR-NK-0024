import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const roles = [
	{
		key: "admin",
		title: "Admin",
		subtitle: "Manage system access",
		accent: "from-emerald-500 to-cyan-500",
		chip: "bg-emerald-100 text-emerald-700",
	},
	{
		key: "customer",
		title: "Customer / Patient",
		subtitle: "View plans and reports",
		accent: "from-amber-500 to-orange-500",
		chip: "bg-amber-100 text-amber-700",
	},
	{
		key: "doctor",
		title: "Doctor / Nutritionist",
		subtitle: "Review patient insights",
		accent: "from-rose-500 to-yellow-500",
		chip: "bg-rose-100 text-rose-700",
	},
];

const Login = () => {
	const [selectedRole, setSelectedRole] = useState("admin");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cyan-50 via-amber-50 to-rose-50 px-4 py-12">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -left-16 top-12 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl animate-pulse" />
				<div className="absolute right-8 top-32 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
				<div className="absolute -bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-300/30 blur-3xl animate-pulse" />
			</div>

			<div className="relative z-10 mx-auto w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_35px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl">
				<div className="relative p-8 sm:p-10">
					<div className="absolute inset-x-6 -top-4 h-10 rounded-full bg-gradient-to-r from-cyan-500/20 via-amber-500/20 to-rose-500/20 blur-2xl" />
					<div className="mb-8">
						<span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
							<span className="h-2 w-2 rounded-full bg-amber-300" />
							Role Access
						</span>
						<h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
							Sign in to your workspace
						</h1>
						<p className="mt-2 text-sm text-slate-600">
							Pick a role and continue with your credentials.
						</p>
					</div>

					<div className="mb-6 grid gap-4 md:grid-cols-3">
						{roles.map((role) => (
							<button
								key={role.key}
								type="button"
								onClick={() => setSelectedRole(role.key)}
								className={`group rounded-2xl border px-4 py-4 text-left transition-all duration-300 hover:-translate-y-1 ${
									selectedRole === role.key
										? "border-slate-900/20 bg-white shadow-xl"
										: "border-slate-200 bg-white/70 hover:border-slate-300 hover:shadow-lg"
								}`}
							>
								<div className={`h-2 w-full rounded-full bg-gradient-to-r ${role.accent}`} />
								<div className="mt-4 flex items-center justify-between">
									<h3 className="text-sm font-semibold text-slate-900">{role.title}</h3>
									<span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${role.chip}`}>
										Selected
									</span>
								</div>
								<p className="mt-2 text-xs text-slate-500">{role.subtitle}</p>
							</button>
						))}
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
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
							<label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
							<input
								type="password"
								name="password"
								placeholder="Enter your password"
								required
								className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
							/>
						</div>

						<div className="flex items-center justify-between text-sm">
							<label className="flex items-center gap-2 text-slate-600">
								<input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
								Remember me
							</label>
							<button type="button" className="font-semibold text-amber-700 hover:text-amber-900">
								Forgot password?
							</button>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<button
								type="submit"
								className="rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
							>
								Sign in
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
						Don&apos;t have an account?{" "}
						<button
							className="font-semibold text-slate-900 hover:underline"
							type="button"
							onClick={() => navigate("/register")}
						>
							Sign up
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
