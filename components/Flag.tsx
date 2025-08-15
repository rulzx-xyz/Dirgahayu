import React from 'react';

const Flag: React.FC = () => {
    return (
        <div className="group mx-auto my-10 w-[200px] sm:w-[250px] transition-transform duration-500 ease-in-out animate-flag-wave hover:animate-none hover:scale-105" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}>
            <svg
                viewBox="0 0 600 400"
                className="h-auto w-full rounded-md"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="wave-filter" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence baseFrequency="0.015 0.03" numOctaves="2" seed="2" type="fractalNoise">
                            <animate 
                                attributeName="baseFrequency" 
                                values="0.015 0.03;0.02 0.04;0.015 0.03" 
                                dur="8s" 
                                repeatCount="indefinite" 
                            />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" scale="25" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                    <linearGradient id="red-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#e60000' }} />
                        <stop offset="100%" style={{ stopColor: '#c00' }} />
                    </linearGradient>
                    <linearGradient id="white-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#ffffff' }} />
                        <stop offset="100%" style={{ stopColor: '#f0f0f0' }} />
                    </linearGradient>
                </defs>
                <g style={{ filter: 'url(#wave-filter)' }}>
                    <rect x="0" y="0" width="600" height="200" fill="url(#red-gradient)" />
                    <rect x="0" y="200" width="600" height="200" fill="url(#white-gradient)" />
                </g>
            </svg>
        </div>
    );
};

export default Flag;