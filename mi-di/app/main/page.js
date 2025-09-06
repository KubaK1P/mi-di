"use client"
import { useMemo } from "react";
import Bar from "../components/Bar/Bar";
import Popup from "../components/Popup/Popup";

//placeholder for something bigger btw
// Predefined random heights to ensure consistency across refreshes
const PREDEFINED_HEIGHTS = [1, 3, 2, 4, 1, 2, 3, 1, 4, 3, 2, 1, 4, 2, 3, 1, 4, 3, 2, 1, 3, 2, 4, 1];

export default function Main() {
    // Generate bars with predefined heights
    const bars = useMemo(() => 
        PREDEFINED_HEIGHTS.map((height, i) => ({ height, pos: i + 1 })),
    []);

    return (
        <>  
            <div className="p-4 pb-0 w-full h-[100svh] relative">
                <h1 className="mt-[96px] text-center text-9xl font-extrabold tracking-wide cool-text">Hello, mi-di</h1>
                <div className="absolute bottom-0 left-0 w-full h-[27px] bg-accent z-2"></div>
                <div className="absolute bottom-[27px] left-0 w-full h-[27px] cool-gradient z-1"></div>
                <div className="absolute bottom-[54px] left-0 w-full h-[25vh] grid grid-cols-24 grid-rows-4 cool-ass-shadow z-[-5]">
                    {bars.map((bar, index) => (
                        <Bar key={index} height={bar.height} pos={bar.pos} />
                    ))}
                </div>
            </div>
            <Popup></Popup>
        </>
    );
}