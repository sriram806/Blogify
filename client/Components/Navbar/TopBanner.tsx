"use client";

import { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5'

export const TopBanner = () => {
    const [bannerVisible, setBannerVisible] = useState(true)
    return (
        <div>
            {bannerVisible && (
                <div className="flex justify-center items-center gap-4 py-3 bg-black text-white text-sm relative">
                    <button className="inline-flex gap-2 items-center hover:text-gray-300">
                        <span>Get Started for free</span>
                        <FaArrowRight />
                    </button>

                    <button
                        onClick={() => setBannerVisible(false)}
                        className="absolute right-4 text-lg hover:text-gray-300"
                    >
                        <IoClose />
                    </button>
                </div>
            )}
        </div>
    )
}
