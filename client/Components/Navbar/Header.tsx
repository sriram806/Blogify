"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { TopBanner } from "./TopBanner";
import SmallMediumMenu from "./SmallMediumMenu";
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
  { name: "Write", href: "/blog/write" },
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
  const headerRef = useRef<HTMLElement | null>(null);
  const [menuTopOffset, setMenuTopOffset] = useState(0);
  const visibleNavItems = user ? navItems : navItems.filter((item) => item.name !== "Write");

  useEffect(() => {
    const updateMenuTopOffset = () => {
      if (!headerRef.current) return;
      setMenuTopOffset(headerRef.current.getBoundingClientRect().height);
    };

    updateMenuTopOffset();
    window.addEventListener("resize", updateMenuTopOffset);

    return () => {
      window.removeEventListener("resize", updateMenuTopOffset);
    };
  }, [menuOpen]);

  const clearClientData = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:5000/api/v1/users"}/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearClientData();
      setUser(null);
      setProfileOpen(false);
      window.location.reload();
    }
  };

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 w-full">
        {!user && (
          <div className={menuOpen ? "hidden lg:block" : "block"}>
            <TopBanner />
          </div>
        )}
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
              <div className="hidden lg:flex items-center gap-8">
                <nav className="flex gap-8">
                  {visibleNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    if (!item.children) {
                      if (item.name === "Write") {
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-white transition duration-200 ${
                              isActive
                                ? "bg-linear-to-r from-sky-300 to-sky-600"
                                : "bg-linear-to-r from-sky-300 to-sky-400 hover:from-sky-600 hover:to-sky-800"
                            }`}
                          >
                            Write
                          </Link>
                        );
                      }

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
                          <div className="absolute top-ful w-56 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
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
                <div className="relative px-1 py-1">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 cursor-pointer bg-white/60 px-1 py-1 rounded-full border border-gray-200 hover:bg-white transition"
                  >
                    <div className="relative w-6 h-6">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-3xl text-gray-600" />
                      )}
                    </div>
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
                            href="/users/profile"
                            onClick={() => setProfileOpen(false)}
                            className="block rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            View profile
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              handleLogout();
                              setProfileOpen(false);
                            }}
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
                className="lg:hidden text-2xl"
              >
                <TiThMenu />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SmallMediumMenu
        menuOpen={menuOpen}
        menuTopOffset={menuTopOffset}
        pathname={pathname}
        navItems={visibleNavItems}
        user={user}
        onClose={() => setMenuOpen(false)}
        onOpenLogin={() => {
          setLoginOpen(true);
          setMenuOpen(false);
        }}
        onOpenRegister={() => {
          setRegisterOpen(true);
          setMenuOpen(false);
        }}
        onLogout={handleLogout}
      />

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