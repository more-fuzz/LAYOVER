import Link from "next/link";
import { getPublishedActivities } from "@/services/activities";
import { getPublishedDestinations } from "@/services/destinations";
import {
  Compass,
  MapPin,
  Ghost,
  Trophy,
  Gift,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Mountain,
  Award,
  CheckCircle2,
  Navigation,
} from "lucide-react";

export default async function Home() {
  const activities = await getPublishedActivities();
  const destinations = await getPublishedDestinations();

  const featuredActivities = activities.slice(0, 4);
  const featuredDestinations = destinations.slice(0, 3);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Background photo with atmospheric dark gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transform motion-safe:animate-fade-in"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a100d] via-[#0a100d]/80 to-[#0a100d]/40 z-10" />

        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-6 backdrop-blur-md shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Gamified Adventure Travel & Verifiable Memoirs</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Explore the Wild.{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent">
              Uncover Enigmas.
            </span>{" "}
            Chronicle Your Legend.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Summit alpine peaks, freedive blue holes, and navigate forgotten folklore ruins. Verify proof of completion, earn adventure points, redeem real gear, and build your personal explorer memoir.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/explorer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-900/40 hover:scale-[1.02] transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Launch Explorer Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/brave-enough"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm bg-[#15231c]/90 hover:bg-[#1f3529] border border-amber-500/40 hover:border-amber-400 text-amber-300 shadow-xl backdrop-blur-md transition-all"
            >
              <Ghost className="w-4 h-4 text-amber-400" />
              <span>&quot;Am I Brave Enough?&quot;</span>
            </Link>
          </div>

          {/* Live Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-8 border-t border-[#1f3529]/60">
            <div className="p-3 bg-[#0e1813]/60 rounded-xl border border-[#1b2f23]">
              <div className="text-2xl font-black text-emerald-400">8+</div>
              <div className="text-xs text-zinc-400">Outdoor Disciplines</div>
            </div>
            <div className="p-3 bg-[#0e1813]/60 rounded-xl border border-[#1b2f23]">
              <div className="text-2xl font-black text-amber-400">100%</div>
              <div className="text-xs text-zinc-400">Verified Evidence</div>
            </div>
            <div className="p-3 bg-[#0e1813]/60 rounded-xl border border-[#1b2f23]">
              <div className="text-2xl font-black text-purple-400">6</div>
              <div className="text-xs text-zinc-400">Folklore Enigmas</div>
            </div>
            <div className="p-3 bg-[#0e1813]/60 rounded-xl border border-[#1b2f23]">
              <div className="text-2xl font-black text-teal-400">2,500+</div>
              <div className="text-xs text-zinc-400">Points Redeemable</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Adventure Activities */}
      <section className="py-20 bg-[#0d1612] border-t border-[#17271d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Curated Expeditions
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Featured Adventure Challenges
              </h2>
            </div>
            <Link
              href="/explorer"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <span>View all expeditions on Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredActivities.map((act) => (
              <div
                key={act.id}
                className="group flex flex-col rounded-2xl bg-[#121e18] border border-[#1d3126] hover:border-emerald-600/70 overflow-hidden shadow-lg transition-all hover:-translate-y-1"
              >
                {/* Photo */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={act.image_url}
                    alt={act.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-300 uppercase tracking-wide">
                    {act.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-950/90 border border-emerald-600/50 px-2 py-0.5 rounded-full text-xs font-bold text-emerald-300">
                    +{act.base_points} pts
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{act.location_name}</span>
                    </div>
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-2">
                      {act.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#182a20] flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-zinc-500">Difficulty: </span>
                      <span className="font-bold text-amber-400">
                        {"★".repeat(act.difficulty)}
                        <span className="text-zinc-600">{"★".repeat(5 - act.difficulty)}</span>
                      </span>
                    </div>
                    <Link
                      href={`/activities/${act.id}`}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. "Am I Brave Enough?" Spooky Trails Feature Teaser */}
      <section className="py-20 bg-gradient-to-b from-[#0a100d] via-[#100c17] to-[#0a100d] border-t border-[#231a33] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/50 mb-3">
                <Ghost className="w-3.5 h-3.5" />
                <span>Dedicated Spooky Exploration Experience</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                &quot;Am I Brave Enough?&quot; Mysterious Destinations
              </h2>
              <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
                Explore approved, publicly accessible folklore wonders, subterranean labyrinths, and desert ghost towns. Labelled with authentic historical facts, local legends, and daylight safety guidelines.
              </p>
            </div>
            <Link
              href="/brave-enough"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/60 transition-all"
            >
              <span>Enter Spooky Mode</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group flex flex-col rounded-2xl bg-[#13111f] border border-[#27203d] hover:border-purple-500/60 overflow-hidden shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-purple-950/90 border border-purple-700/60 px-2.5 py-1 rounded-md text-[10px] font-bold text-purple-300 uppercase tracking-wide">
                    {dest.category.replace("_", " ")}
                  </div>
                  {dest.spooky_rating && (
                    <div className="absolute top-3 right-3 bg-black/80 px-2 py-0.5 rounded-full text-xs font-bold text-amber-300">
                      Spook Index: {dest.spooky_rating}/5 👻
                    </div>
                  )}
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors mb-2">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                      {dest.description}
                    </p>
                    {dest.folklore_legend && (
                      <div className="p-3 bg-[#1d172e] rounded-xl border border-[#31254d] text-xs text-purple-200 italic line-clamp-2">
                        &quot;{dest.folklore_legend}&quot;
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#231b38] flex items-center justify-between text-xs">
                    <span className="text-zinc-500">📍 {dest.location_name}</span>
                    <Link
                      href={`/brave-enough#${dest.id}`}
                      className="font-bold text-purple-400 hover:text-purple-300"
                    >
                      Read Legend &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How the Gamified System Works */}
      <section className="py-20 bg-[#0d1612] border-t border-[#17271d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              How Gamified Adventure Works
            </h2>
            <p className="text-sm text-zinc-400">
              Transform your outdoor expeditions into verified achievements, collectible badges, and tangible rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#121f18] border border-[#1e3328] relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400 mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-2">1. Choose Challenge</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Browse our interactive Explorer map for verified alpine ascents, kayaking routes, or historical enigmas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121f18] border border-[#1e3328] relative">
              <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-600/50 flex items-center justify-center text-teal-400 mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-2">2. Submit Proof</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Upload your summit or expedition photo with coordinates to our private storage vault for validation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121f18] border border-[#1e3328] relative">
              <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-600/50 flex items-center justify-center text-amber-400 mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-2">3. Earn Points</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Once verified by administrators, points are added to your ledger, boosting your rank on the leaderboard.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121f18] border border-[#1e3328] relative">
              <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-600/50 flex items-center justify-center text-purple-400 mb-4 font-bold text-lg">
                4
              </div>
              <h3 className="text-base font-bold text-white mb-2">4. Redeem & Chronicle</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Exchange points for expedition gear, vouchers, and badges, while curating your permanent travel memoir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Big Call-To-Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-950 via-[#0e1d16] to-[#0a140f] border-t border-b border-[#1b3124] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
            Ready to Begin Your Adventure?
          </h2>
          <p className="text-base text-zinc-300 max-w-xl mx-auto mb-8">
            Join a global community of climbers, divers, and folklore explorers today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-xl transition-all"
            >
              Create Traveler Account
            </Link>
            <Link
              href="/explorer"
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-[#16271e] hover:bg-[#1f372a] border border-[#264434] text-emerald-300 transition-all"
            >
              Browse Destinations Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
