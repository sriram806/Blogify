"use client";

import { useState } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type RegisterModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
};

const API_BASE =
    process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:5000/api/v1/users";
const GOOGLE_AUTH_URL = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;
const GITHUB_AUTH_URL = process.env.NEXT_PUBLIC_GITHUB_AUTH_URL;

const RegisterModal = ({
    isOpen,
    onClose,
    onSwitchToLogin,
}: RegisterModalProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formVisible, setFormVisible] = useState(false);

    const handleSocialAuth = (provider: "google" | "github") => {
        const url = provider === "google" ? GOOGLE_AUTH_URL : GITHUB_AUTH_URL;
        if (!url) {
            setError(`${provider === "google" ? "Google" : "GitHub"} auth not configured.`);
            return;
        }
        window.location.href = url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result?.success) {
                setError(result?.message || "Registration failed");
                return;
            }

            setSuccess("Account created successfully!");
            setName("");
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
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-white rounded-md shadow-2xl overflow-hidden grid md:grid-cols-2">

                    {/* 🖼️ LEFT IMAGE PANEL */}
                    <div className="relative hidden md:block">
                        <Image
                            src="/images/register-blog.jpg"   // 👈 replace with your image
                            alt="Register illustration"
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Overlay content */}
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
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

                        <h1 className="text-2xl font-semibold text-black">Create account</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Join a community of writers and readers exploring meaningful stories.
                        </p>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={() => handleSocialAuth("google")}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium"
                            >
                                <FcGoogle  size={20}/>
                                Sign up with Google
                            </button>

                            <button
                                onClick={() => handleSocialAuth("github")}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium"
                            >
                                <FaGithub size={20} />
                                Sign up with GitHub
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-500 font-medium">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {!formVisible ? (
                            <button
                                onClick={() => setFormVisible(true)}
                                className="w-full px-4 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition cursor-pointer"
                            >
                                Continue with Email
                            </button>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                                />

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
                                    {loading ? "Creating account..." : "Create account"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormVisible(false)}
                                    className="w-full text-sm text-gray-600 hover:text-black py-2"
                                >
                                    Back
                                </button>
                            </form>
                        )}

                        <p className="mt-6 flex items-center justify-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <button
                                onClick={() => {
                                    onClose();
                                    setTimeout(onSwitchToLogin);
                                }}
                                className="font-medium text-black ml-2 hover:underline"
                            >
                                Login Here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterModal;