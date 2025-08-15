
import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="loader-dual-ring"></div>
            <p className="text-lg text-yellow-300 text-glow-gold">AI sedang merangkai kata...</p>
        </div>
    );
};

export default Loader;