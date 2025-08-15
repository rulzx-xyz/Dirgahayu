
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './Loader';

interface InteractiveMapProps {
    onClose: () => void;
    onGenerate: (prompt: string, location: string) => void;
    story: string;
    isGenerating: boolean;
    error: string | null;
    selectedLocation: string | null;
}

const mapPoints = [
    { id: 'sumatra', name: 'Sumatra', cx: '15%', cy: '45%' },
    { id: 'jawa', name: 'Jawa', cx: '35%', cy: '75%' },
    { id: 'kalimantan', name: 'Kalimantan', cx: '45%', cy: '45%' },
    { id: 'sulawesi', name: 'Sulawesi', cx: '65%', cy: '55%' },
    { id: 'papua', name: 'Papua', cx: '88%', cy: '60%' },
];

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onClose, onGenerate, story, isGenerating, error, selectedLocation }) => {
    
    const handlePointClick = (point: {id: string, name: string}) => {
        const prompt = `Ceritakan secara detail dan mendalam (sekitar 3-4 paragraf) tentang seorang pahlawan nasional atau peristiwa penting dari pulau ${point.name} yang berkaitan dengan perjuangan kemerdekaan Indonesia. Sertakan latar belakang, kronologi peristiwa penting, dan dampak atau warisannya bagi bangsa. Gunakan bahasa Indonesia yang formal dan menggugah semangat.`;
        onGenerate(prompt, point.name);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-6xl p-6 sm:p-8 rounded-2xl bg-black/60 backdrop-blur-lg border-2 border-yellow-400/50 shadow-2xl shadow-black/50 story-container-glow"
        >
             <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors" aria-label="Tutup Peta">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
            <h3 className="font-montserrat text-2xl font-bold tracking-wider text-yellow-300 text-glow-gold sm:text-3xl text-center mb-4">
                Perjuangan Pahlawan Indonesia
            </h3>
            <p className="text-center text-slate-300 mb-6">Jelajahi peta dan kenali nama-nama pahlawan serta kisah perjuangan mereka dari berbagai penjuru Indonesia.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative w-full aspect-[4/2]">
                    <svg viewBox="0 0 350 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M11.1 63.6C4.5 55.5 3.3 54.2 3.8 45.4c.5-8.4 2.8-9.4 10-5.8 4.8 2.3 9.3 5.3 10.5 6.8 1.4 1.7 1.8 4.4 1.8 11.5 0 7.2-.5 10-1.8 10.8-1.5 1-4.8-1.6-8.2-6.1zM58.9 99.4c-4.4-2.8-8-5.7-8-6.5-.1-.8.9-3.2 2.3-5.3 3.3-5.3 11.5-6 16.5-1.4 2.6 2.4 2.7 4.1 1 8.9-3 8.7-6.2 11.1-11.8 8.8zM42.3 80.2c-1.3-1-2.3-2.6-2.3-3.5s.9-2.2 2-2.5c2.2-.6 4.7 2.1 4.7 5.2 0 1.9-1.2 3.1-2.7 2.8-1-.2-1.4-.8-1.7-2z M107.8 88.5c-4.3-1.6-7-4-8.8-7.8-1-2.1-1.8-4.8-1.8-6.2 0-3.2 2-5.7 6.2-7.8 4.9-2.5 12.3-2.5 16.5-.1 2.2 1.3 4.2 3 4.3 3.8.2 1.5-3.3 6.1-8.1 10.7-3.9 3.7-8.3 6.4-9.8 6.1-1.1-.2-1.9-.9-1.5-1.7z M127.3 57.3c-2-2.2-2.2-3.8-.8-6.3 3.4-6.3 12.7-7.2 16.5-1.7 2.1 3 2.1 6.3 0 9.1-2.3 3.1-4.5 4-8.2 3.4-3.2-.5-5.6-2-7.5-4.5zM172.4 83.1c-1-3.1-1.2-6.5-1-10.1.3-5.8 1.4-9.8 3.5-12.7 3.9-5.3 10.1-7 16.3-4.5 7.8 3.1 11.4 10.3 9.1 18.5-1.1 3.9-3.7 8.3-5.8 9.8-3.4 2.4-8.6 2.4-12.2 0-2.3-1.5-4.1-3.6-4.9-5.5z M235.6 71.8c-2.7-2.6-4.5-5.9-4.5-8.3s1.8-5.7 4.5-8.3c4.7-4.7 12.5-4.7 17.1 0 2.7 2.6 4.5 5.9 4.5 8.3s-1.8 5.7-4.5 8.3c-4.6 4.7-12.4 4.7-17.1 0z M214.2 49.3c-2-3-2.2-6.3-.5-9.1 3.9-6.3 13.2-5.4 16.5 1.7 1.8 3.8 1.5 7.8-1 9.9-3.2 2.7-6.5 2.7-9.8 0-1.7-1.4-2.7-3.2-3.2-4-1-1.5-1.5-1.5-2 1.5z M301.6 78.4c-4.1-.3-8-2-8.7-3.8-.7-1.8-.1-4.4 1.8-8.1 4.5-8.8 12.8-13 19.3-9.5 7.3 3.9 8.8 10.5 4 17-2.7 3.6-7 6.3-11.2 7-2 .3-2.8.3-5.2-.6z" fill="rgba(255, 255, 255, 0.1)" stroke="#BE123C" strokeWidth=".5"/>
                        {mapPoints.map(point => (
                             <circle 
                                key={point.id}
                                cx={point.cx} 
                                cy={point.cy} 
                                r="8" 
                                className={`map-point ${selectedLocation === point.name ? 'active' : ''}`}
                                onClick={() => handlePointClick(point)}
                             />
                        ))}
                    </svg>
                </div>
                <div className="relative min-h-[250px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isGenerating && (
                            <motion.div key="loader" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                                <Loader />
                            </motion.div>
                        )}
                        {error && (
                            <motion.p key="error" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-red-400 text-center">{error}</motion.p>
                        )}
                        {story && !isGenerating && (
                            <motion.div
                                key="story"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full"
                            >
                                <h4 className="text-2xl font-bold text-yellow-300 text-shadow-highlight mb-3">Kisah dari {selectedLocation}</h4>
                                <p className="whitespace-pre-wrap text-left text-white/90 text-shadow-lyrics max-h-[250px] overflow-y-auto pr-2">
                                    {story}
                                </p>
                            </motion.div>
                        )}
                        {!selectedLocation && !isGenerating && !error && (
                            <motion.p key="initial" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-slate-400 text-lg text-center">Pilih sebuah titik di peta...</motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

        </motion.div>
    );
};

export default InteractiveMap;