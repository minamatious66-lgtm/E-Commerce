
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCartIcon, UserIcon, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const linkStyle = (path: string) =>
    `relative text-lg font-bold transition-all duration-300
     ${pathname === path ? "text-white dark:text-white after:w-full" : "text-white/90 dark:text-gray-200 hover:text-white after:w-0 hover:after:w-full"}
     after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-white after:transition-all after:duration-300`;

  return (
    <nav className="fixed top-0 left-0 w-full
      bg-gray-900/95 dark:bg-gray-900/95
      backdrop-blur-sm shadow-md transition-colors duration-300 z-50">

      <div className="flex items-center justify-between h-14 px-4">

        
        <Link href="/" className="text-xl font-bold hover:scale-105 transition-transform text-white">
          ShopMart
        </Link>

        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/products" className={linkStyle("/products")}>Products</Link>
          <Link href="/brands" className={linkStyle("/brands")}>Brands</Link>
          <Link href="/categories" className={linkStyle("/categories")}>Categories</Link>
        </div>

        
        <div className="flex items-center gap-3">

          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:scale-105 transition-transform bg-gray-700/70"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-white" />}
          </button>

          
          <Link href="/cart" className="p-2 rounded-full hover:scale-105 transition-transform bg-gray-700/70">
            <ShoppingCartIcon size={22} className="text-white"/>
          </Link>

          
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-3 py-1 rounded-md text-white hover:bg-gray-700/50 transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="p-2 rounded-full hover:scale-105 transition-transform bg-gray-700/70">
              <UserIcon size={22} className="text-white"/>
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}