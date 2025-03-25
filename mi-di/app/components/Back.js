"use client"

export default function Back({row, column, color, handleScroll, scrollTo, children}) {
    let textColor = "dark";
    if (color === "main" || color === "dark") {
        textColor = "lighter";
    }
    return (
        <>
        <div onClick={() => handleScroll(scrollTo)} className={"group transition-all flex flex-col cursor-pointer justify-end relative top-0 hover:top-4 hover:brightness-90 brightness-100 go-back-card p-4 rounded-lg bg-" + color } style={{ gridArea: row + " / " + column + " / " + (parseInt(row) + 1) + " / " + (parseInt(column) + 1) }}>
            <h3 className={"transition-all group-hover:underline group-hover:text-3xl text-2xl font-bold tracking-wide text-" + textColor }>{children}</h3>
        </div>
        </>
    );
}