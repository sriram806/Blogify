"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { TopBanner } from "./TopBanner";
import LoginModal from "@/Components/Auth/LoginModal";
import RegisterModal from "@/Components/Auth/RegisterModal";
import { useAuth } from "@/Components/Auth/AuthProvider";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Blogs",
    href: "/blog",
    children: [
      { name: "Featured", href: "/#featured" },
      { name: "Trending", href: "/#trending" },
      { name: "Recommended", href: "/#recommended" },
      { name: "Latest", href: "/blog?sort=latest" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:5000/api/v1/users"}/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch {
      // ignore logout errors
    } finally {
      setUser(null);
      setProfileOpen(false);
    }
  };


  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <TopBanner />
        {/* Navbar */}
        <div className="bg-white/50 backdrop-blur-sm ">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link href="/">
                <Image
                  src="/logo.webp"
                  alt="Blogify Logo"
                  width={200}
                  height={60}
                  priority
                />
              </Link>


              {/* Desktop Nav + Profile */}
              <div className="hidden md:flex items-center gap-8">
                <nav className="flex gap-8">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    if (!item.children) {
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`transition-colors ${isActive ? "text-black font-semibold" : "text-gray-700 hover:text-black"}`}
                        >
                          {item.name}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={item.name}
                        className="relative"
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <button
                          type="button"
                          className={`flex items-center gap-2 transition-colors ${isActive ? "text-black font-semibold" : "text-gray-700 hover:text-black"}`}
                        >
                          {item.name}
                          <span className="text-xs">▾</span>
                        </button>

                        {activeDropdown === item.name && (
                          <div className="absolute top-full mt-3 w-56 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100">
                              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                                Explore
                              </p>
                              <p className="text-sm font-semibold text-black">Blog Highlights</p>
                            </div>
                            <div className="py-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition"
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>

                {/* Profile */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 cursor-pointer bg-white/60 px-3 py-2 rounded-full border border-gray-200 hover:bg-white transition"
                  >
                    <FaUserCircle className="text-2xl text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user?.name ? user.name.split(" ")[0] : "Account"}
                    </span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                      <div className="px-4 py-4 border-b border-gray-100">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          {user ? "Signed in" : "Welcome"}
                        </p>
                        <p className="text-sm font-semibold text-black">
                          {user?.name || "Guest"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user?.email || "Login to personalize your feed"}
                        </p>
                      </div>

                      {!user && (
                        <div className="p-4 space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              setLoginOpen(true);
                              setProfileOpen(false);
                            }}
                            className="w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white"
                          >
                            Login
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRegisterOpen(true);
                              setProfileOpen(false);
                            }}
                            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800"
                          >
                            Register
                          </button>
                        </div>
                      )}

                      {user && (
                        <div className="p-4 space-y-2">
                          <Link
                            href="/profile"
                            className="block rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            View profile
                          </Link>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(true)}
                className="md:hidden text-2xl"
              >
                <TiThMenu />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sheet */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />

        <div
          className={`absolute inset-x-0 top-0 mx-auto w-full max-w-md rounded-b-3xl bg-white shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-y-0" : "-translate-y-full"
            }`}
        >
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Menu</p>
            </div>
            <button onClick={() => setMenuOpen(false)}>
              <IoClose className="text-xl" />
            </button>
          </div>


          {/* Nav Items */}
          <nav className="px-6 pb-6">
            <div className="rounded-2xl border border-gray-100 bg-white">
              {navItems.map((item, index) => (
                <div key={item.name} className="border-b last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-4 text-sm font-semibold text-gray-800"
                  >
                    {item.name}
                    {item.children && <span className="text-xs text-gray-400">›</span>}
                  </Link>

                  {item.children && (
                    <div className="px-4 pb-4 flex flex-col gap-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="text-sm text-gray-500 hover:text-black transition"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Profile Section */}
          <div className="px-6 pb-8">
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-2xl">
              <FaUserCircle className="text-3xl text-gray-600" />
              <div>
                <p className="font-semibold">{user?.name || "Guest User"}</p>
                <p className="text-sm text-gray-500">
                  {user?.email || "View Profile"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {!user ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-full bg-black px-4 py-3 text-sm font-medium text-white"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm font-medium text-gray-800"
                  >
                    Register
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-full bg-gray-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
};

export default Header;