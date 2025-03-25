"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const pathName = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="w-full p-[32px_64px] fixed top-0 left-0 flex justify-between z-998">
            <Link href="/" className="text-white font-bold text-2xl cool-text-small">&lt; Back to the lobby</Link>
            <h2 className="text-white font-bold text-2xl cool-text-small">
                {mounted ? pathName : "..."}
            </h2>
        </nav>
    );
}