
import React, { useEffect, useState } from 'react';

interface Particle {
    id: number;
    style: React.CSSProperties;
}

const ParticleBackground: React.FC = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const generateParticles = () => {
            const particleCount = Math.floor(window.innerWidth / 20);
            const newParticles: Particle[] = [];
            for (let i = 0; i < particleCount; i++) {
                const size = Math.random() * 4 + 1;
                const posX = Math.random() * window.innerWidth;
                const posY = Math.random() * window.innerHeight;
                const duration = Math.random() * 20 + 15;
                const delay = Math.random() * 10;
                
                newParticles.push({
                    id: i,
                    style: {
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${posX}px`,
                        top: `${posY}px`,
                        animationDuration: `${duration}s`,
                        animationDelay: `${delay}s`,
                    },
                });
            }
            setParticles(newParticles);
        };
        
        generateParticles();
        window.addEventListener('resize', generateParticles);
        
        return () => window.removeEventListener('resize', generateParticles);
    }, []);

    return (
        <div className="fixed top-0 left-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-yellow-300/70 animate-float"
                    style={p.style}
                ></div>
            ))}
        </div>
    );
};

export default ParticleBackground;
