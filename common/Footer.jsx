import Link from 'next/link';
import { 
  FiExternalLink,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin
} from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white pt-20 pb-10 px-6 border-t border-gray-100 overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-blue-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#2667ff 1px, transparent 1px), linear-gradient(90deg, #2667ff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Logo and Description */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/">
              <img src="assets/Finale_beacon_logo.png" alt="Collegy" className="w-40 md:w-48 mb-6" />
            </Link>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#2667ff] hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
                <FiFacebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#2667ff] hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
                <FiTwitter size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#2667ff] hover:text-white transition-all duration-300 shadow-sm border border-gray-100">
                <FiInstagram size={18} />
              </a>
              {/* LinkedIn page link */}
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2667ff] hover:bg-[#2667ff] hover:text-white transition-all duration-300 shadow-sm border border-blue-100">
                <FiLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Platform", 
                links: [
                  { name: "AI College Predictor", href: "/AiCollegePredictor" },
                  { name: "Explore Colleges", href: "/explore" },
                  { name: "Book Consultation", href: "/book-consultation" },
                  { name: "Education Loan", href: "/education-loan" }
                ] 
              },
              { 
                title: "Programs", 
                links: [
                  { name: "Internships", href: "/internships" },
                  // { name: "Be a Partner", href: "/be-a-partner" },
                  { name: "Refer & Earn", href: "/refer-earn" }
                ] 
              },
              { 
                title: "Company", 
                links: [
                  { name: "About Us", href: "/about-us" },
                  { name: "Contact Us", href: "/contact-us" },
                  { name: "Terms & Conditions", href: "/terms-conditions" }
                ] 
              }
            ].map((group, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-bold text-gray-900 mb-6 tracking-wide uppercase">
                  {group.title}
                </h4>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                  {group.links.map((linkItem, lIdx) => (
                    <li key={lIdx}>
                      <Link href={linkItem.href} className="hover:text-[#2667ff] transition-colors inline-flex items-center group">
                        <span className="relative overflow-hidden">
                          <span className="block transition-transform duration-300 group-hover:-translate-y-full">{linkItem.name}</span>
                          <span className="block absolute top-0 left-0 transition-transform duration-300 translate-y-full text-[#2667ff] group-hover:translate-y-0">{linkItem.name}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <p className="text-gray-400 text-sm font-medium">
              © {currentYear} Finalebeacon
            </p>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
              <span className="flex items-center gap-2 hover:text-[#2667ff] transition-colors cursor-pointer group">
                India's #1 Platform <FiExternalLink size={14} className="text-gray-300 group-hover:text-[#2667ff] transition-colors" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
