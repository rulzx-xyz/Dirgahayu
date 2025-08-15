import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="mb-8 text-center">
            <h1 className="font-montserrat text-4xl sm:text-5xl md:text-6xl tracking-wider text-glow-gold bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent">
                DIRGAHAYU REPUBLIK INDONESIA
            </h1>
            <div className="mt-4 flex justify-center items-center gap-2 sm:gap-4">
                <span className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-bold text-glow-white text-slate-200">
                    KE-
                </span>
                <div className="hero-badge font-montserrat">
                    80
                </div>
            </div>
            <p className="mt-4 text-base sm:text-lg text-glow-white text-slate-300">
                17 AGUSTUS 1945 - 17 AGUSTUS 2025
            </p>
            <p className="mt-1 text-lg sm:text-xl font-semibold text-glow-gold text-yellow-300">
                Menuju Indonesia Emas 2045
            </p>
        </header>
    );
};

export default Header;