"use client";

import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

type NavChild = {
  name: string;
  href: string;
};

type NavItem = {
  name: string;
  href: string;
  children?: NavChild[];
};

type AuthUser = {
  name?: string;
  email?: string;
};

type SmallMediumMenuProps = {
  menuOpen: boolean;
  menuTopOffset: number;
  pathname: string;
  navItems: NavItem[];
  user: AuthUser | null;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
};

const SmallMediumMenu = ({
  menuOpen,
  menuTopOffset,
  pathname,
  navItems,
  user,
  onClose,
  onOpenLogin,
  onOpenRegister,
  onLogout,
}: SmallMediumMenuProps) => {
  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-300 lg:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ top: menuTopOffset }}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <div
          className={`absolute inset-x-0 top-0 mx-auto w-full max-w-md rounded bg-white shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-y-0" : "-translate-y-full"}`}
        >
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Menu</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-2 text-gray-700 hover:bg-gray-100 transition"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          <nav className="px-6 pb-6">
            <div className="rounded border border-gray-100 bg-white">
              {navItems.map((item) => {
                const isItemActive =
                  pathname === item.href ||
                  (item.href === "/blog" && pathname.startsWith("/blog"));

                return (
                  <div key={item.name} className="border-b last:border-b-0">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-4 py-4 text-sm font-semibold transition ${isItemActive ? "bg-gray-50 text-black" : "text-gray-800 hover:bg-gray-50"}`}
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
                            onClick={onClose}
                            className="text-sm text-gray-500 hover:text-black transition"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="px-6 py-15 pb-8">
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded">
              <FaUserCircle className="text-3xl text-gray-600" />
              <div>
                <p className="font-semibold">{user?.name || "Guest User"}</p>
                <p className="text-sm text-gray-500">{user?.email || "View Profile"}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {!user ? (
                <>
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="w-full rounded-full bg-black px-4 py-3 text-sm font-medium text-white"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm font-medium text-gray-800"
                  >
                    Register
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full rounded-full bg-gray-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmallMediumMenu;
