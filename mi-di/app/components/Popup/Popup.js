import { useState, useEffect } from "react";
import * as Tone from "tone";

export default function Popup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div 
            className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center z-1200"
            onClick={handleClose}
        >
            <div className="transition-all hover:bottom-[60px] absolute cursor-pointer bottom-[40px] right-[40px] w-[20vw] h-[20vh] p-4 bg-light rounded-lg shadow-lg">
                <p className="text-dark text-2xl font-semibold">
                    Click this (or anything on the site) to enable audio playback for the current site.
                </p>
            </div>
        </div>
    );
}