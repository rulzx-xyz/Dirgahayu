import React from 'react';

interface GarudaProps {
    isGlowing: boolean;
}

const Garuda: React.FC<GarudaProps> = ({ isGlowing }) => {
    const glowClass = isGlowing ? 'garuda-power-glow' : '';

    return (
        <div className="flex justify-center items-center mb-4">
            <img
                src="https://files.catbox.moe/6io4na.jpg"
                alt="Lambang Negara Garuda Pancasila"
                className={`w-40 h-auto sm:w-48 animate-majestic-pulse ${glowClass}`}
            />
        </div>
    );
};

export default Garuda;