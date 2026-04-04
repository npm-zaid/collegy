// ─── COLLEGES ───────────────────────────────────────────────────
export const COLLEGES_DATA = [
  {
    id: 1, name: "IIT Bombay", featured: true, rank: 1,
    type: "IIT", state: "Maharashtra", city: "Mumbai",
    courses: ["Engineering", "Technology", "Sciences"],
    seats: 1050, fee: "₹2,18,000", category: "Government", estd: 1958,
    about: "IIT Bombay is one of India's premier engineering institutes, known for research excellence and global alumni network.",
    accreditation: "NAAC A++", nirf: 3, website: "https://www.iitb.ac.in",
    exams: ["JEE Advanced"],
    placements: { avg: "₹21 LPA", highest: "₹2.8 CPA", companies: 450 },
  },
  {
    id: 2, name: "IIT Delhi", featured: true, rank: 2,
    type: "IIT", state: "Delhi", city: "New Delhi",
    courses: ["Engineering", "Technology"],
    seats: 880, fee: "₹2,15,000", category: "Government", estd: 1961,
    about: "IIT Delhi is a leader in technology and innovation.",
    accreditation: "NAAC A++", nirf: 2, website: "https://home.iitd.ac.in",
    exams: ["JEE Advanced"],
    placements: { avg: "₹19 LPA", highest: "₹2.5 CPA", companies: 400 },
  },
  {
    id: 3, name: "IIM Ahmedabad", featured: true, rank: 1,
    type: "IIM", state: "Gujarat", city: "Ahmedabad",
    courses: ["Management", "MBA"],
    seats: 410, fee: "₹23,00,000", category: "Government", estd: 1961,
    about: "Premier management institute of India.",
    accreditation: "AACSB", nirf: 1, website: "https://www.iima.ac.in",
    exams: ["CAT"],
    placements: { avg: "₹34 LPA", highest: "₹1.2 CPA", companies: 180 },
  },
  {
    id: 4, name: "AIIMS Delhi", featured: true, rank: 1,
    type: "AIIMS", state: "Delhi", city: "New Delhi",
    courses: ["Medicine", "MBBS", "Nursing"],
    seats: 720, fee: "₹6,000", category: "Government", estd: 1956,
    about: "India's top medical institution.",
    accreditation: "NAAC A++", nirf: 1, website: "https://www.aiims.edu",
    exams: ["NEET"],
    placements: { avg: "₹18 LPA", highest: "₹40 LPA", companies: 120 },
  },
  {
    id: 5, name: "NLSIU Bangalore", featured: true, rank: 1,
    type: "University", state: "Karnataka", city: "Bangalore",
    courses: ["Law", "LLB", "LLM"],
    seats: 480, fee: "₹2,75,000", category: "Government", estd: 1986,
    about: "National Law School, top law college in India.",
    accreditation: "NAAC A++", nirf: 1, website: "https://nls.ac.in",
    exams: ["CLAT"],
    placements: { avg: "₹15 LPA", highest: "₹60 LPA", companies: 200 },
  },
  {
    id: 6, name: "NIT Trichy", featured: false, rank: 8,
    type: "NIT", state: "Tamil Nadu", city: "Tiruchirappalli",
    courses: ["Engineering", "Technology"],
    seats: 1250, fee: "₹1,75,000", category: "Government", estd: 1964,
    about: "Top NIT with excellent placements.",
    accreditation: "NAAC A+", nirf: 8, website: "https://www.nitt.edu",
    exams: ["JEE Main"],
    placements: { avg: "₹12 LPA", highest: "₹80 LPA", companies: 320 },
  },
  {
    id: 7, name: "BITS Pilani", featured: true, rank: 6,
    type: "Institute", state: "Rajasthan", city: "Pilani",
    courses: ["Engineering", "Sciences", "Management"],
    seats: 2000, fee: "₹5,18,000", category: "Private", estd: 1964,
    about: "Top private engineering institute.",
    accreditation: "NAAC A", nirf: 16, website: "https://www.bits-pilani.ac.in",
    exams: ["BITSAT"],
    placements: { avg: "₹14 LPA", highest: "₹1.2 CPA", companies: 350 },
  },
  {
    id: 8, name: "VIT Vellore", featured: false, rank: 12,
    type: "University", state: "Tamil Nadu", city: "Vellore",
    courses: ["Engineering", "Technology", "Management"],
    seats: 7000, fee: "₹1,80,000", category: "Private", estd: 1984,
    about: "VIT is one of the largest private universities.",
    accreditation: "NAAC A++", nirf: 11, website: "https://vit.ac.in",
    exams: ["VITEEE"],
    placements: { avg: "₹7 LPA", highest: "₹44 LPA", companies: 500 },
  },
];

// ─── USERS ──────────────────────────────────────────────────────
export const USERS_DATA = [
  { id: 1, name: "Arjun Sharma", email: "arjun.sharma@gmail.com", phone: "9876543210", role: "Student", joined: "Jan 12, 2026", status: "Active" },
  { id: 2, name: "Priya Mehta", email: "priya.m@yahoo.com", phone: "9823456789", role: "Parent", joined: "Jan 18, 2026", status: "Active" },
  { id: 3, name: "Rohan Gupta", email: "rohan.g@gmail.com", phone: "9712345678", role: "Student", joined: "Feb 2, 2026", status: "Active" },
  { id: 4, name: "Sneha Patel", email: "sneha.p@hotmail.com", phone: "9634567890", role: "Student", joined: "Feb 8, 2026", status: "Inactive" },
  { id: 5, name: "Karan Verma", email: "karan.v@gmail.com", phone: "9545678901", role: "Student", joined: "Feb 14, 2026", status: "Active" },
  { id: 6, name: "Anjali Singh", email: "anjali.s@gmail.com", phone: "9456789012", role: "Parent", joined: "Feb 20, 2026", status: "Active" },
  { id: 7, name: "Dev Krishnan", email: "dev.k@outlook.com", phone: "9367890123", role: "Student", joined: "Mar 1, 2026", status: "Active" },
  { id: 8, name: "Isha Nair", email: "isha.n@gmail.com", phone: "9278901234", role: "Student", joined: "Mar 7, 2026", status: "Active" },
  { id: 9, name: "Manav Sethi", email: "manav.s@gmail.com", phone: "9189012345", role: "Student", joined: "Mar 12, 2026", status: "Active" },
  { id: 10, name: "Ritika Jha", email: "ritika.j@gmail.com", phone: "9090123456", role: "Parent", joined: "Mar 18, 2026", status: "Inactive" },
];

// ─── CONSULTATIONS ──────────────────────────────────────────────
export const CONSULT_DATA = [
  { id: 1, name: "Rahul Das", email: "rahul.das@gmail.com", phone: "9812345670", interest: "Engineering / IIT", date: "Mar 28, 2026", status: "Pending" },
  { id: 2, name: "Meera Joshi", email: "meera.j@gmail.com", phone: "9723456781", interest: "Medicine / AIIMS", date: "Mar 29, 2026", status: "Scheduled" },
  { id: 3, name: "Akash Reddy", email: "akash.r@gmail.com", phone: "9634567892", interest: "Management / IIM", date: "Mar 30, 2026", status: "Pending" },
  { id: 4, name: "Pooja Agarwal", email: "pooja.a@yahoo.com", phone: "9545678903", interest: "Law / NLSIU", date: "Mar 30, 2026", status: "Done" },
  { id: 5, name: "Nikhil Bansal", email: "nikhil.b@gmail.com", phone: "9456789014", interest: "Engineering / NIT", date: "Apr 1, 2026", status: "Pending" },
  { id: 6, name: "Swati Mishra", email: "swati.m@gmail.com", phone: "9367890125", interest: "Sciences / Research", date: "Apr 1, 2026", status: "Scheduled" },
  { id: 7, name: "Amit Tiwari", email: "amit.t@gmail.com", phone: "9278901236", interest: "Design / Arts", date: "Apr 2, 2026", status: "Pending" },
  { id: 8, name: "Nidhi Kumar", email: "nidhi.k@gmail.com", phone: "9189012347", interest: "Engineering / BITS", date: "Apr 2, 2026", status: "Pending" },
  { id: 9, name: "Siddharth Roy", email: "sid.r@gmail.com", phone: "9090123458", interest: "Computer Science", date: "Apr 3, 2026", status: "Pending" },
  { id: 10, name: "Neha Kapoor", email: "neha.k@gmail.com", phone: "8981234569", interest: "Architecture", date: "Apr 3, 2026", status: "Pending" },
];

// ─── LOANS ──────────────────────────────────────────────────────
export const LOAN_DATA = [
  { id: 1, name: "Vishal Yadav", email: "vishal.y@gmail.com", college: "IIT Bombay", amount: "₹8,00,000", date: "Mar 25, 2026", bank: "SBI", status: "Reviewing" },
  { id: 2, name: "Kavya Menon", email: "kavya.m@gmail.com", college: "IIM Ahmedabad", amount: "₹15,00,000", date: "Mar 27, 2026", bank: "HDFC", status: "Approved" },
  { id: 3, name: "Suresh Pillai", email: "suresh.p@gmail.com", college: "AIIMS Delhi", amount: "₹3,00,000", date: "Mar 28, 2026", bank: "PNB", status: "Pending" },
  { id: 4, name: "Tanvi Shah", email: "tanvi.s@gmail.com", college: "BITS Pilani", amount: "₹6,00,000", date: "Mar 29, 2026", bank: "Axis", status: "Reviewing" },
  { id: 5, name: "Rohit Jain", email: "rohit.j@gmail.com", college: "VIT Vellore", amount: "₹4,00,000", date: "Mar 30, 2026", bank: "SBI", status: "Pending" },
  { id: 6, name: "Ananya Roy", email: "ananya.r@gmail.com", college: "NIT Trichy", amount: "₹5,00,000", date: "Apr 1, 2026", bank: "ICICI", status: "Pending" },
  { id: 7, name: "Farhan Khan", email: "farhan.k@gmail.com", college: "IIT Delhi", amount: "₹9,00,000", date: "Apr 2, 2026", bank: "HDFC", status: "Pending" },
  { id: 8, name: "Lakshmi Iyer", email: "lakshmi.i@gmail.com", college: "NLSIU Bangalore", amount: "₹7,00,000", date: "Apr 3, 2026", bank: "Canara", status: "Reviewing" },
];

// ─── INTERNSHIPS ─────────────────────────────────────────────────
export const INTERN_DATA = [
  { id: 1, name: "Aditya Khanna", email: "aditya.k@gmail.com", college: "IIT Delhi", skills: "React, Node.js", duration: "3 months", date: "Mar 22, 2026", status: "Shortlisted" },
  { id: 2, name: "Riya Bose", email: "riya.b@gmail.com", college: "BITS Pilani", skills: "Python, ML", duration: "6 months", date: "Mar 24, 2026", status: "Pending" },
  { id: 3, name: "Aryan Sood", email: "aryan.s@gmail.com", college: "NIT Trichy", skills: "Design, Figma", duration: "2 months", date: "Mar 26, 2026", status: "Pending" },
  { id: 4, name: "Shreya Pandey", email: "shreya.p@gmail.com", college: "VIT Vellore", skills: "Content, SEO", duration: "3 months", date: "Mar 28, 2026", status: "Rejected" },
  { id: 5, name: "Varun Malik", email: "varun.m@gmail.com", college: "IIT Bombay", skills: "Java, Spring", duration: "4 months", date: "Mar 29, 2026", status: "Shortlisted" },
  { id: 6, name: "Diya Rao", email: "diya.r@gmail.com", college: "Delhi University", skills: "Marketing", duration: "2 months", date: "Mar 30, 2026", status: "Pending" },
  { id: 7, name: "Kush Sethi", email: "kush.s@gmail.com", college: "NLSIU", skills: "Legal Research", duration: "3 months", date: "Apr 1, 2026", status: "Pending" },
  { id: 8, name: "Tara Gupta", email: "tara.g@gmail.com", college: "IIM Ahmedabad", skills: "Finance, Excel", duration: "6 months", date: "Apr 2, 2026", status: "Pending" },
  { id: 9, name: "Zaid Ansari", email: "zaid.a@gmail.com", college: "BITS Goa", skills: "DevOps, AWS", duration: "4 months", date: "Apr 3, 2026", status: "Pending" },
];

// ─── NEWS ────────────────────────────────────────────────────────
export const NEWS_DATA = [
  { id: 1, title: "JEE Advanced 2025 Registration Opens April 15", category: "JEE/NEET", emoji: "📰", source: "NTA Official", date: "Apr 1, 2026", summary: "The National Testing Agency has announced that JEE Advanced registrations will begin from April 15. Students who cleared JEE Main cut-off are eligible to apply.", url: "#" },
  { id: 2, title: "IIT Rankings: IIT Bombay retains #1 in NIRF 2025", category: "Rankings", emoji: "📊", source: "NIRF", date: "Mar 28, 2026", summary: "The Ministry of Education released the NIRF 2025 rankings. IIT Bombay retains its top position in the engineering category for the third consecutive year.", url: "#" },
  { id: 3, title: "NEET UG 2025 Exam Date Announced – May 4", category: "JEE/NEET", emoji: "🔬", source: "NTA", date: "Mar 25, 2026", summary: "NEET UG 2025 will be conducted on May 4, 2025. Admit cards will be available from April 25. Students must carry a valid photo ID.", url: "#" },
  { id: 4, title: "New Scholarship Scheme for SC/ST Students by UGC", category: "Scholarships", emoji: "💰", source: "UGC India", date: "Mar 20, 2026", summary: "UGC announced a new merit-cum-means scholarship for SC/ST students pursuing higher education. Applications open till April 30.", url: "#" },
  { id: 5, title: "IIM Placement Season 2025: Average Package Hits ₹35 LPA", category: "Placements", emoji: "🎓", source: "Economic Times", date: "Mar 15, 2026", summary: "IIM final placement season concluded with record highs. IIM Ahmedabad reported an average package of ₹35 LPA, while IIM Bangalore crossed ₹33 LPA.", url: "#" },
  { id: 6, title: "NEP 2020 Update: 4-Year UG Programs Now Mandatory", category: "Policy", emoji: "📚", source: "Ministry of Education", date: "Mar 10, 2026", summary: "The Ministry of Education confirmed that all central universities must shift to 4-year undergraduate programs by 2026 under the National Education Policy.", url: "#" },
];

export const ACTIVITY_DATA = [
  { dot: "#2667ff", text: "<b>New user</b> Arjun Sharma registered", time: "2m ago" },
  { dot: "#f59e0b", text: "<b>Consultation</b> booked by Meera Joshi", time: "15m ago" },
  { dot: "#10b981", text: "<b>IIT Madras</b> added to college list", time: "1h ago" },
  { dot: "#f43f5e", text: "<b>Loan request</b> from Kavya Menon approved", time: "2h ago" },
  { dot: "#8b5cf6", text: "<b>News article</b> published: NEET 2025", time: "3h ago" },
  { dot: "#10b981", text: "<b>Internship</b> offer sent to Aditya Khanna", time: "5h ago" },
];