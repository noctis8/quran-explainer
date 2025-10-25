import React, { useState, useEffect } from 'react';

const Tooltip = ({ children, content }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!document.getElementById('tooltip-animation-style')) {
            const style = document.createElement('style');
            style.id = 'tooltip-animation-style'; // Give it an ID to prevent re-adding
            style.textContent = `
              @keyframes scale-subtle {
                0% { 
                  opacity: 0; 
                  transform: translateX(-50%) scale(0.9);
                }
                100% { 
                  opacity: 1; 
                  transform: translateX(-50%) scale(1);
                }
              }
              .animate-scale-subtle {
                animation: scale-subtle 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `;
            document.head.appendChild(style);
        }
    }, []);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="cursor-pointer"
            >
                {children}
            </div>

            {show && (
                <div
                    className="absolute top-full mt-2 left-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg animate-scale-subtle"
                    // break line for the tooltip if its more than 2 words
                    style={{
                        width: 'auto',
                        maxWidth: '14rem',
                        whiteSpace: content.split(' ').length <= 2 ? 'nowrap' : 'normal',
                    }}
                >
                    <span className="font-medium">{content}</span>
                    <div className="absolute bottom-full left-1/2 -ml-1 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;