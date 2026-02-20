"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaArrowRight, FaSearch, FaUserCircle } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { TopBanner } from "./TopBanner";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Blogs", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    window.location.href = `/blog?search=${search}`;
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

              {/* Desktop Search */}
              <form
                onSubmit={handleSearch}
                className="hidden md:flex items-center bg-white/60 px-3 py-2 rounded-full border-2 border-gray-300 w-1/3"
              >
                <FaSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                />
              </form>

              {/* Desktop Nav + Profile */}
              <div className="hidden md:flex items-center gap-8">
                <nav className="flex gap-8">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`transition-colors ${isActive ? "text-black font-semibold" : "text-gray-700 hover:text-black"}`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Profile */}
                <div className="flex items-center cursor-pointer bg-white/60 px-3 py-2 rounded-full border border-gray-200 hover:bg-white transition">
                  <FaUserCircle className="text-2xl text-gray-600" />
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

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white/90 backdrop-blur-xl shadow-xl z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-5 flex justify-between items-center border-b">
          <h2 className="font-semibold text-lg">Menu</h2>
          <button onClick={() => setMenuOpen(false)}>
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="p-4">
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </form>

        {/* Nav Items */}
        <nav className="flex flex-col gap-4 px-6 mt-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-lg font-medium text-gray-700 hover:text-black transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="mt-8 px-6">
          <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
            <FaUserCircle className="text-3xl text-gray-600" />
            <div>
              <p className="font-semibold">Guest User</p>
              <p className="text-sm text-gray-500">View Profile</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;