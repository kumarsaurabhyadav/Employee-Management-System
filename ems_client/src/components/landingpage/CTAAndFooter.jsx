import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTAAndFooter = () => {
  return (
    <>
      {/* -------- CTA SECTION -------- */}
      <section className="relative py-20 sm:py-28 px-6 overflow-hidden bg-[#0a0a0a] border-t border-white/5">

        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-125 bg-white/2 blur-3xl rounded-full pointer-events-none"></div>

        <div className="absolute bottom-0 right-0 w-72 h-72 bg-zinc-500/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in">

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-[-0.04em] leading-none mb-6">
            Ready to transform your
            <br className="hidden sm:block" />
            workforce management?
          </h2>

          <p className="text-sm sm:text-lg text-zinc-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of companies already using our platform to streamline their HR operations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Free Trial
              <ArrowRightIcon className="w-4 h-4" />
            </Link>

            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/3 text-white border border-white/10 rounded-xl text-sm font-bold transition-all duration-300 hover:bg-white/10 hover:border-white/20 backdrop-blur-md text-center"
            >
              Contact Sales
            </a>

          </div>

        </div>
      </section>

      {/* -------- FOOTER SECTION -------- */}
      <footer className="bg-[#0a0a0a] pt-14 pb-8 px-6 border-t border-white/5">

        {/* 🚀 THE FIX: max-w-7xl ko max-w-5xl kar diya taaki columns zayda fade na aur center mein compact lagein */}
        <div className="max-w-5xl mx-auto">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

            {/* Column 1 */}
            <div>
              <h4 className="text-white font-bold mb-5 text-xs tracking-widest uppercase">
                Product
              </h4>

              <ul className="space-y-3.5">
                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Features
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Pricing
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Security
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-white font-bold mb-5 text-xs tracking-widest uppercase">
                Company
              </h4>

              <ul className="space-y-3.5">
                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    About
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Careers
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Blog
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-white font-bold mb-5 text-xs tracking-widest uppercase">
                Resources
              </h4>

              <ul className="space-y-3.5">
                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Documentation
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Help Center
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    API Reference
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-white font-bold mb-5 text-xs tracking-widest uppercase">
                Legal
              </h4>

              <ul className="space-y-3.5">
                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Terms of Service
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    Cookie Policy
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-500 hover:text-white transition-all duration-300"
                  >
                    GDPR
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright */}
          <div className="border-t border-white/5 pt-8 text-center">

            <p className="text-xs font-medium text-zinc-500 tracking-wide">
              &copy; {new Date().getFullYear()} EmployeeMS. All rights reserved.
            </p>

          </div>

        </div>
      </footer>
    </>
  );
};

export default CTAAndFooter;