import { useState, useEffect } from "react";

function GoUp() {
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            const isScrolled = window.pageYOffset > 300;

            if (isScrolled && !shouldRender) {
                setShouldRender(true);
                setTimeout(() => setIsVisible(true), 10);
            } else if (!isScrolled && shouldRender) {
                setIsVisible(false);
                setTimeout(() => setShouldRender(false), 300);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [shouldRender]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!shouldRender) return null;

    const animationClasses = isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-4";
    return (
        <button
            className={`group fixed bottom-8 right-8 z-50 p-2 text-white rounded-full shadow-lg 
                       bg-gradient-to-r from-[var(--btn2-f)] to-[var(--btn2-t)] 
                       transition-all duration-300 ease-out transform hover:scale-110 active:scale-95
                       ${animationClasses}`}
            onClick={scrollToTop}
        >
            {/* Button content */}
            <div className="relative">
                {/* Arrow icon with progressive reveal effect */}
                <div className="relative w-7 h-7">
                    <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 w-2 h-2 border-l-2 border-t-2 border-white rotate-45 transition-all duration-300 group-hover:scale-110"></div>

                    {/* Arrow stem - reveals progressively on hover */}
                    <div className="absolute top-[21%] left-1/2 transform -translate-x-1/2 w-0.5 bg-white transition-all duration-500 ease-out group-hover:h-4 h-0 origin-top"></div>
                </div>
            </div>

            {/* Ripple effect on click */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 scale-0 group-active:opacity-30 group-active:scale-150 transition-all duration-200"></div>
        </button>
    );
}

export default GoUp;