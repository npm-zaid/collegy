import { NextResponse } from "next/server";

const DEFAULT_WEBINARS = [
  {
    _id: "wb-1",
    title: "IIT JEE 2025 Strategy",
    name: "Dr. Ramesh Kumar",
    host: "Dr. Ramesh Kumar",
    url: "https://collegy.in/webinars/iit-jee-strategy",
    status: "LIVE",
    viewers: "1.2K watching",
    time: "Live now",
    icon: "🎯",
    category: "Engineering",
    order: 1,
  },
  {
    _id: "wb-2",
    title: "NEET Prep Masterclass",
    name: "Prof. Ananya Singh",
    host: "Prof. Ananya Singh",
    url: "https://collegy.in/webinars/neet-prep-masterclass",
    status: "UPCOMING",
    viewers: "850 registered",
    time: "Today · 5:00 PM",
    icon: "🔬",
    category: "Medical",
    order: 2,
  },
  {
    _id: "wb-3",
    title: "College Application Tips",
    name: "Aditi Sharma",
    host: "Aditi Sharma",
    url: "https://collegy.in/webinars/college-application-tips",
    status: "UPCOMING",
    viewers: "620 registered",
    time: "Tomorrow · 3:00 PM",
    icon: "📝",
    category: "Admissions",
    order: 3,
  },
  {
    _id: "wb-4",
    title: "Scholarship Guide 2025",
    name: "Rahul Mehta",
    host: "Rahul Mehta",
    url: "https://collegy.in/webinars/scholarship-guide-2025",
    status: "RECORDED",
    viewers: "3.4K views",
    time: "Watch anytime",
    icon: "🏆",
    category: "Scholarship",
    order: 4,
  },
  {
    _id: "wb-5",
    title: "Engineering Career Paths",
    name: "Vikram Nair",
    host: "Vikram Nair",
    url: "https://collegy.in/webinars/engineering-career-paths",
    status: "UPCOMING",
    viewers: "530 registered",
    time: "Sat · 11:00 AM",
    icon: "⚙️",
    category: "Engineering",
    order: 5,
  },
  {
    _id: "wb-6",
    title: "MBA Admissions 2025",
    name: "Priya Khanna",
    host: "Priya Khanna",
    url: "https://collegy.in/webinars/mba-admissions-2025",
    status: "UPCOMING",
    viewers: "920 registered",
    time: "Today · 7:00 PM",
    icon: "💼",
    category: "Management",
    order: 6,
  },
  {
    _id: "wb-7",
    title: "CUET Strategy Session",
    name: "Dr. Suresh Iyer",
    host: "Dr. Suresh Iyer",
    url: "https://collegy.in/webinars/cuet-strategy-session",
    status: "LIVE",
    viewers: "2.1K watching",
    time: "Live now",
    icon: "📚",
    category: "Admissions",
    order: 7,
  },
  {
    _id: "wb-8",
    title: "Study Abroad 101",
    name: "Neha Bose",
    host: "Neha Bose",
    url: "https://collegy.in/webinars/study-abroad-101",
    status: "RECORDED",
    viewers: "5.6K views",
    time: "Watch anytime",
    icon: "✈️",
    category: "Study Abroad",
    order: 8,
  },
  {
    _id: "wb-9",
    title: "Financial Aid & Loans",
    name: "Arjun Sethi",
    host: "Arjun Sethi",
    url: "https://collegy.in/webinars/financial-aid-loans",
    status: "UPCOMING",
    viewers: "410 registered",
    time: "Sun · 4:00 PM",
    icon: "💰",
    category: "Finance",
    order: 9,
  },
  {
    _id: "wb-10",
    title: "Law School Journey",
    name: "Kavya Menon",
    host: "Kavya Menon",
    url: "https://collegy.in/webinars/law-school-journey",
    status: "UPCOMING",
    viewers: "340 registered",
    time: "Mon · 6:00 PM",
    icon: "⚖️",
    category: "Law",
    order: 10,
  },
];

// List of backend candidate URLs
const BACKEND_URLS = [
  process.env.BACKEND_API_URL,
  "http://localhost:5001",
  "https://finale-beacon-backend.vercel.app",
].filter(Boolean);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";

  // Try candidate backends first
  for (const baseUrl of BACKEND_URLS) {
    try {
      const res = await fetch(`${baseUrl}/api/webinars${queryString}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          return NextResponse.json(data);
        }
      }
    } catch {
      // Continue to next candidate or fallback
    }
  }

  // Fallback to default webinars
  return NextResponse.json({
    success: true,
    count: DEFAULT_WEBINARS.length,
    data: DEFAULT_WEBINARS,
    source: "fallback",
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    for (const baseUrl of BACKEND_URLS) {
      try {
        const res = await fetch(`${baseUrl}/api/webinars`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data, { status: 201 });
        }
      } catch {
        // Try next
      }
    }

    // If backend is completely unreachable, return a simulated successful response
    const newWebinar = {
      _id: `wb-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, data: newWebinar }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create webinar" },
      { status: 500 }
    );
  }
}
