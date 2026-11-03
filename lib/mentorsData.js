// Shared mentor data + helpers used by:
//   app/mentors/page.jsx        (list)
//   app/mentors/[id]/page.jsx   (detail)
// Save as lib/mentorsData.js (imports below use the "@/lib/mentorsData" alias;
// switch to a relative path if your project has no "@" alias).

export const API = "https://finale-beacon-backend.vercel.app";

export const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export const imgSrc = (v) => (!v ? null : v.startsWith("http") ? v : `${API}/uploads/${v}`);

const DEFAULT_QUOTE = "I still remember being clueless on day one, now I help others skip that phase";
const aboutFor = (name) =>
  `Hi, I'm ${name}. I've been through the same confusions many students face, adjusting to campus life, managing academics, and finding the right path forward. I'm here to guide you with honest, practical advice so you don't have to figure it all out alone.`;

const mentor = (id, name, college, campus, expertise, tone, year = "2nd Year") => ({
  id, name, college, campus, expertise, tone, year,
  price: 59, price15: 59, price30: 99,
  languages: ["English", "Hindi"],
  about: aboutFor(name),
  quote: DEFAULT_QUOTE,
  slots: [], // ISO date-time strings, e.g. "2026-10-20T17:00:00+05:30". Empty = "No open slots right now"
  cover: null, photo: null, logo: null,
});

// Used when the API has no mentors endpoint / is offline.
export const FALLBACK_MENTORS = [
  mentor("m1", "Sharaj R Shetty", "Intellipaat School of Technology", "Bangalore, Karnataka", ["Campus Life", "Internship"], "from-fuchsia-600 via-purple-600 to-orange-500"),
  mentor("m2", "Vidhu Mahajan", "Scaler School of Technology", "Bangalore, Karnataka", ["Campus Life", "Academic Life"], "from-emerald-700 via-emerald-600 to-teal-500"),
  mentor("m3", "Laksh Bethariya", "Veloces Campus", "Pune, Maharashtra", ["Academic Life", "Campus Life"], "from-sky-400 via-sky-300 to-zinc-200"),
  mentor("m4", "Bhanu Agrawal", "Vedam School of Technology", "Pune, Maharashtra", ["Academic Life", "SAT/Interview"], "from-orange-500 via-amber-500 to-zinc-800"),
  mentor("m5", "Sandeep Yadav", "NIAT", "Hyderabad, Telangana", ["Internship", "Placements"], "from-zinc-500 via-zinc-400 to-red-300"),
  mentor("m6", "Kavya Rajpal", "Vedam School of Technology", "Pune, Maharashtra", ["Campus Life", "Hostel Life"], "from-orange-500 via-amber-500 to-zinc-800"),
  mentor("m7", "Aarav Rane", "Scaler School of Technology", "Bangalore, Karnataka", ["Internship", "Academic Life"], "from-emerald-700 via-emerald-600 to-teal-500"),
  mentor("m8", "Neha Patil", "Newton School of Technology", "Sonipat, Haryana", ["Internship", "SAT/Interview"], "from-blue-700 via-blue-600 to-sky-500"),
];

// Tolerant mapper so it works with a variety of backend shapes.
export const mapMentor = (m, i = 0) => {
  const price = m.sessionPrice ?? m.price ?? 59;
  const name = m.name || m.fullName || "Mentor";
  return {
    id: m._id || m.id || `api-${i}`,
    name,
    college: m.college?.name || m.collegeName || m.college || "Unknown College",
    campus: m.campus || [m.location?.city, m.location?.state].filter(Boolean).join(", ") || "India",
    expertise: m.expertise || m.specialties || m.tags || m.topics || [],
    year: m.year || m.yearOfStudy || null,
    languages: m.languages || ["English", "Hindi"],
    about: m.about || m.bio || aboutFor(name),
    quote: m.quote || m.tagline || DEFAULT_QUOTE,
    price,
    price15: m.price15 ?? m.pricing?.[15] ?? price,
    price30: m.price30 ?? m.pricing?.[30] ?? 99,
    slots: m.slots || m.availability || [],
    tone: "from-[#2667ff] to-[#3f8efc]",
    cover: imgSrc(m.coverImage || m.cover),
    photo: imgSrc(m.photo || m.avatar || m.profileImage),
    logo: imgSrc(m.collegeLogo || m.logo),
  };
};

// Fetch one mentor by id: API first, then the local fallback list. Returns null if not found.
export async function fetchMentorById(id) {
  try {
    const res = await fetch(`${API}/api/mentors/${encodeURIComponent(id)}`); // assumed endpoint
    if (res.ok) {
      const json = await res.json();
      const raw = json?.data ?? json;
      if (raw && typeof raw === "object" && !Array.isArray(raw)) return mapMentor(raw);
    }
  } catch (e) {
    console.error("Failed to fetch mentor", e);
  }
  return FALLBACK_MENTORS.find((m) => m.id === id) || null;
}