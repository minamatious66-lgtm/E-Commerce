
"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "SHOP",
      links: ["Electronics", "Fashion", "Home & Garden", "Sports", "Deals"],
      hrefs: ["/categories", "/categories", "/categories", "/categories", "/categories"],
    },
    {
      title: "CUSTOMER SERVICE",
      links: ["Contact Us", "Help Center", "Track Your Order", "Returns & Exchanges", "Size Guide"],
      hrefs: ["/contact","/help","/track-order","/returns","/size-guide"],
    },
    {
      title: "ABOUT",
      links: ["About ShopMart","Careers","Press","Investor Relations","Sustainability"],
      hrefs: ["/about","/careers","/press","/investor-relations","/sustainability"],
    },
    {
      title: "POLICIES",
      links: ["Privacy Policy","Terms of Service","Cookie Policy","Shipping Policy","Refund Policy"],
      hrefs: ["/privacy-policy","/terms-of-service","/cookie-policy","/shipping-policy","/refund-policy"],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white dark:bg-gray-200 text-gray-900 flex items-center justify-center rounded-full mr-3 shadow transition-transform hover:scale-110">
                <span className="font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold tracking-wide">ShopMart</span>
            </div>
            <p className="text-white/70 text-sm mb-6 leading-relaxed font-medium">
              Your one-stop destination for the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.
            </p>

            
            <div className="space-y-3 text-white/70 text-sm font-medium">
              <div className="flex items-center gap-2 hover:text-red-400 transition-all duration-300 cursor-pointer">
                <MapPin size={16} />
                <span>123 Shop Street, Octoper City, DC 12345</span>
              </div>
              <div className="flex items-center gap-2 hover:text-red-400 transition-all duration-300 cursor-pointer">
                <Phone size={16} />
                <span>(+20) 01093333333</span>
              </div>
              <div className="flex items-center gap-2 hover:text-red-400 transition-all duration-300 cursor-pointer">
                <Mail size={16} />
                <span>support@shopmart.com</span>
              </div>
            </div>
          </div>

          
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-white font-bold text-sm mb-3 tracking-wide">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={section.hrefs[i]}
                      className="text-white/80 text-sm font-medium hover:text-red-400 hover:translate-x-0.5 transition-transform duration-300 block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        
        <div className="mt-10 border-t border-white/20 pt-4 text-white/70 text-sm flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="font-medium">© {new Date().getFullYear()} ShopMart. All rights reserved.</span>
          <div className="flex gap-3">
            {["Facebook","Twitter","Instagram","LinkedIn"].map((social, i) => (
              <Link
                key={i}
                href="#"
                className="text-white/70 font-medium hover:text-red-400 transition-transform hover:scale-110 duration-300"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}