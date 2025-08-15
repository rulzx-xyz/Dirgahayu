import React from 'react';
import { motion } from 'framer-motion';

interface LyricLine {
    startTime: number;
    endTime: number;
    text: string;
}

interface LyricOverlayProps {
    title: string;
    lyrics: LyricLine[];
    onClose: (event: React.MouseEvent) => void;
    currentLineIndex: number;
}

const LyricOverlay: React.FC<LyricOverlayProps> = ({ title, lyrics, onClose, currentLineIndex }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative flex w-11/12 max-w-5xl flex-col rounded-2xl border-4 border-yellow-300 bg-gradient-to-br from-red-950/95 to-black/90 p-6 shadow-2xl shadow-yellow-500/40 sm:p-10"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute -top-4 -right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-red-700 text-2xl font-bold text-white transition-transform hover:scale-110" 
                    aria-label="Tutup Lirik"
                >
                    &times;
                </button>
                <h2 className="font-montserrat mb-6 text-center text-4xl font-bold tracking-wider text-yellow-300 text-shadow-epic sm:text-5xl">
                    {title}
                </h2>
                <div className="max-h-[60vh] overflow-y-auto p-4 text-center scroll-smooth">
                    {lyrics.map((line, index) => {
                        const isActive = index === currentLineIndex;
                        return (
                            <p
                                key={`${index}-${line.startTime}`}
                                className={`whitespace-pre-line text-3xl leading-relaxed text-white transition-all duration-300 md:text-5xl ${isActive ? 'font-bold' : ''}`}
                                style={{ minHeight: '1.5em' }} // Prevent layout shift for empty lines
                            >
                                {line.text || ' '}
                            </p>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LyricOverlay;