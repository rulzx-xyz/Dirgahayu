
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiTrigger {
    x: number;
    y: number;
    id: number;
}

interface ConfettiProps {
    triggers: ConfettiTrigger[];
}

const ConfettiPiece: React.FC<{ x: number, y: number }> = ({ x, y }) => {
    const colors = ['#e60000', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const randomX = (Math.random() - 0.5) * 300;
    const randomY = (Math.random() - 0.5) * 300;
    const randomRotate = Math.random() * 360;
    const randomScale = Math.random() * 0.5 + 0.5;

    return (
        <motion.div
            style={{
                position: 'fixed',
                left: x,
                top: y,
                backgroundColor: color,
                width: '8px',
                height: '16px',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
            initial={{ opacity: 1, scale: 0, rotate: 0 }}
            animate={{
                opacity: 0,
                x: randomX,
                y: randomY,
                scale: randomScale,
                rotate: randomRotate,
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
        />
    );
};


const ConfettiBurst: React.FC<{ x: number, y: number, onComplete: () => void }> = ({ x, y, onComplete }) => {
    const pieces = Array.from({ length: 30 }).map((_, i) => <ConfettiPiece key={i} x={x} y={y} />);
    
    useEffect(() => {
        const timer = setTimeout(onComplete, 1000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return <>{pieces}</>;
};

const Confetti: React.FC<ConfettiProps> = ({ triggers }) => {
    const [bursts, setBursts] = useState<ConfettiTrigger[]>([]);

    useEffect(() => {
        if (triggers.length > 0) {
            setBursts(b => [...b, ...triggers]);
        }
    }, [triggers]);
    
    const handleComplete = (id: number) => {
        setBursts(currentBursts => currentBursts.filter(b => b.id !== id));
    };

    return (
        <AnimatePresence>
            {bursts.map(burst => (
                <ConfettiBurst 
                    key={burst.id} 
                    x={burst.x} 
                    y={burst.y} 
                    onComplete={() => handleComplete(burst.id)} 
                />
            ))}
        </AnimatePresence>
    );
};

export default Confetti;
