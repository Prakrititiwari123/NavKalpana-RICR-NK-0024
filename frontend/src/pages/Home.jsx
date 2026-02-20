import React from "react";
import { useNavigate } from "react-router-dom";

const highlights = [
	{
		title: "Smart Plans",
		desc: "Personalized care journeys built from real-time signals.",
	},
	{
		title: "Care Teams",
		desc: "Doctors and nutritionists aligned on one dashboard.",
	},
	{
		title: "Live Insights",
		desc: "Metrics that update as your program evolves.",
	},
];

const Home = () => {
	const navigate = useNavigate();

	return (
		<main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cyan-50 via-amber-50 to-rose-50">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl animate-pulse" />
				<div className="absolute right-8 top-10 h-64 w-64 rounded-full bg-rose-300/30 blur-3xl animate-pulse" />
				<div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
			</div>

			<div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-5 py-16">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-lg">
							NK
						</span>
						<div>
							<p className="text-sm font-semibold text-slate-900">NavKalpana</p>
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Care Intelligence</p>
						</div>
					</div>
					<button
						type="button"
						onClick={() => navigate("/login")}
						className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow"
					>
						Sign in
					</button>
				</header>

				<section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="space-y-6">
						<span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
							<span className="h-2 w-2 rounded-full bg-amber-300" />
							Healthcare Platform
						</span>
						<h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
							Care journeys that feel
							<span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
								{" "}human
							</span>
						</h1>
						<p className="text-base text-slate-600">
							Bring admins, patients, and nutrition teams together with one
							shared source of truth. Beautiful workflows, measurable outcomes.
						</p>
						<div className="flex flex-wrap gap-3">
							<button
								type="button"
								onClick={() => navigate("/register")}
								className="rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
							>
								Get started
							</button>
							<button
								type="button"
								onClick={() => navigate("/login")}
								className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50"
							>
								View login
							</button>
						</div>
						<div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.3em] text-slate-400">
							<span>Secure</span>
							<span>Collaborative</span>
							<span>Insightful</span>
						</div>
					</div>

					<div className="relative">
						<div className="absolute -left-10 top-6 h-28 w-28 rounded-3xl bg-white/70 shadow-lg backdrop-blur-sm animate-pulse" />
						<div className="absolute right-6 top-0 h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 shadow-xl animate-bounce" />
						<div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_35px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl">
							<div className="flex items-center justify-between">
								<p className="text-xs uppercase tracking-[0.3em] text-slate-400">Today</p>
								<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
									Live
								</span>
							</div>
							<h2 className="mt-4 text-2xl font-semibold text-slate-900">
								Patient progress
							</h2>
							<p className="mt-2 text-sm text-slate-600">
								Adaptive targets that shift with real outcomes.
							</p>
							<div className="mt-6 grid gap-4 sm:grid-cols-2">
								{["Nutrition", "Vitals"].map((label) => (
									<div
										key={label}
										className="rounded-2xl border border-slate-200/60 bg-white px-4 py-4 transition hover:-translate-y-1 hover:shadow-lg"
									>
										<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
											{label}
										</p>
										<p className="mt-2 text-lg font-semibold text-slate-900">92%</p>
										<div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
											<div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="grid gap-6 lg:grid-cols-3">
					{highlights.map((item) => (
						<div
							key={item.title}
							className="group rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl"
						>
							<div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-amber-400" />
							<h3 className="mt-4 text-lg font-semibold text-slate-900">
								{item.title}
							</h3>
							<p className="mt-2 text-sm text-slate-600">{item.desc}</p>
							<button
								type="button"
								className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition group-hover:text-slate-900"
							>
								Explore
							</button>
						</div>
					))}
				</section>
			</div>
		</main>
	);
};

export default Home;
