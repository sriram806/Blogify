"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FaEnvelope, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/Components/Auth/AuthProvider";
import { AUTH_CONFIG } from "@/Components/Auth/auth.config";

declare global {
    interface Window {
        google?: any;
    }
}

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
};

const { apiBase: API_BASE, githubAuthUrl: GITHUB_AUTH_URL, googleClientId: GOOGLE_CLIENT_ID } =
    AUTH_CONFIG;

const LoginModal = ({
    isOpen,
    onClose,
    onSwitchToRegister,
}: LoginModalProps) => {
    const { setUser, setGreeting } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [emailExpanded, setEmailExpanded] = useState(false);
    const [googleReady, setGoogleReady] = useState(false);

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return;
        if (window.google) {
            setGoogleReady(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => setGoogleReady(true);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const googleCodeClient = useMemo(() => {
        if (!googleReady || !window.google || !GOOGLE_CLIENT_ID) return null;
        return window.google.accounts.oauth2.initCodeClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "openid email profile",
            callback: async (response: { code?: string; error?: string }) => {
                if (!response?.code) {
                    setError("Google authentication failed");
                    return;
                }

                setLoading(true);
                setError("");
                setSuccess("");

                try {
                    const res = await fetch(`${API_BASE}/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ code: response.code }),
                    });

                    const result = await res.json();

                    if (!res.ok || !result?.success) {
                        setError(result?.message || "Google login failed");
                        return;
                    }

                    setUser(result?.data?.user || null);
                    setGreeting(`Hi ${result?.data?.user?.name || "there"}, welcome back!`);
                    setSuccess("Login successful!");
                    setTimeout(() => onClose(), 1200);
                } catch {
                    setError("Unable to connect to server");
                } finally {
                    setLoading(false);
                }
            },
        });
    }, [googleReady, onClose, setGreeting, setUser]);

    const handleSocialAuth = (provider: "google" | "github") => {
        if (provider === "google") {
            if (googleCodeClient) {
                googleCodeClient.requestCode();
                return;
            }

            setError("Google auth not configured.");
            return;
        }

        if (!GITHUB_AUTH_URL) {
            setError("GitHub auth not configured.");
            return;
        }

        window.location.href = GITHUB_AUTH_URL;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter email and password");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const result = await response.json();

            if (!response.ok || !result?.success) {
                setError(result?.message || "Login failed");
                return;
            }

            setUser(result?.data?.user || null);
            setGreeting(`Hi ${result?.data?.user?.name || "there"}, welcome back!`);
            setSuccess("Login successful!");
            setEmail("");
            setPassword("");
            setTimeout(() => onClose(), 1200);
        } catch {
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-white rounded-md shadow-2xl overflow-hidden grid md:grid-cols-2">

                    {/* 🖼️ LEFT IMAGE PANEL */}
                    <div className="relative hidden md:block">
                        <Image
                            src="/images/login-blog.jpg"   // 👈 replace with your image
                            alt="Login illustration"
                            fill
                            className="object-cover"
                            priority
                        />

                        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 text-white">

                        </div>
                    </div>

                    {/* 🧾 RIGHT FORM PANEL */}
                    <div className="relative p-8 md:p-10">
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 text-gray-400 hover:text-black"
                        >
                            <IoClose className="text-2xl" />
                        </button>

                        <h2 className="text-2xl font-semibold">
                            Welcome back to Blogify
                        </h2>
                        <p className="text-sm mt-2">
                            Continue your journey of reading, writing, and sharing ideas.
                        </p>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={() => handleSocialAuth("google")}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium"
                            >
                                <FcGoogle  size={20}/>
                                Continue with Google
                            </button>

                            <button
                                onClick={() => handleSocialAuth("github")}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium"
                            >
                                <FaGithub size={20} />
                                Continue with GitHub
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-500 font-medium">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {!emailExpanded ? (
                            <button
                                onClick={() => setEmailExpanded(true)}
                                className="w-full flex bg-black text-white items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-900 transition font-medium cursor-pointer"
                            >
                                <FaEnvelope />
                                Continue with Email
                            </button>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                                />

                                {error && <p className="text-sm text-red-600">{error}</p>}
                                {success && <p className="text-sm text-green-600">{success}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition disabled:opacity-50"
                                >
                                    {loading ? "Signing in..." : "Sign in"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setEmailExpanded(false)}
                                    className="w-full text-sm text-gray-600 hover:text-black py-2"
                                >
                                    Back
                                </button>
                            </form>
                        )}

                        <p className="mt-6 flex justify-center items-center text-sm text-gray-600">
                            Don’t have an account?{" "}
                            <button
                                onClick={() => {
                                    onClose();
                                    setTimeout(onSwitchToRegister);
                                }}
                                className="font-medium text-black ml-2 hover:underline"
                            >
                                Create one
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginModal;