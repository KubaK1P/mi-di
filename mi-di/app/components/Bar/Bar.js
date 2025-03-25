export default function Bar({ height, pos }) {
    let barColor = "lighter";
    switch (height) {
        case 1:
            barColor = "dark";
            break;
        case 2:
            barColor = "main";
            break;
        case 3:
            barColor = "accent";
            break;
        case 4:
            barColor = "light";
            break;
    }
    return (
        <div 
            className={`bg-${barColor}`}
            style={{ gridArea: `${4 - height + 1} / ${pos} / 5 / ${parseInt(pos) + 1}` }}
        ></div>
    );
}
