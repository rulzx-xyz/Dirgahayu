
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './components/Header';
import Flag from './components/Flag';
import ActionButton from './components/ActionButton';
import FireworksCanvas from './components/FireworksCanvas';
import ParticleBackground from './components/ParticleBackground';
import AICorner from './components/AICorner';
import Confetti from './components/Confetti';
import PhotoBooth from './components/PhotoBooth';
import LyricOverlay from './components/LyricOverlay';
import Garuda from './components/Garuda';

interface ConfettiTrigger {
    x: number;
    y: number;
    id: number;
}

const tanahAirkuLyrics = [
    { startTime: 15.1, endTime: 21.7, text: "Tanah airku tidak kulupakan..." },
    { startTime: 22.1, endTime: 28.8, text: "Kan terkenang selama hidupku..." },
    { startTime: 29.3, endTime: 35.8, text: "Biarpun saya pergi jauh" },
    { startTime: 36.3, endTime: 42.8, text: "Tidak kan hilang dari kalbu..." },
    { startTime: 43.3, endTime: 49.9, text: "Tanahku yang kucintai" },
    { startTime: 50.3, endTime: 56.8, text: "Engkau kuhargai......" },
];

const indonesiaRayaLyrics = [
    { startTime: 17.5, endTime: 24.5, text: "Indonesia tanah airku, Tanah tumpah darahku" },
    { startTime: 24.9, endTime: 31.5, text: "Di sanalah aku berdiri, Jadi pandu ibuku..." },
    { startTime: 32.0, endTime: 38.8, text: "Indonesia kebangsaanku, Bangsa dan tanah airku" },
    { startTime: 39.3, endTime: 46.5, text: "Marilah kita berseru, \"Indonesia bersatu!\"" },
    { startTime: 46.8, endTime: 53.5, text: "Hiduplah tanahku, hiduplah negeriku\nBangsaku, rakyatku, semuanya" },
    { startTime: 54.0, endTime: 60.8, text: "Bangunlah jiwanya, bangunlah badannya\nUntuk Indonesia Raya" },
    { startTime: 61.3, endTime: 68.3, text: "Indonesia Raya, merdeka, merdeka!\nTanahku, negeriku yang kucinta" },
    { startTime: 68.8, endTime: 78.5, text: "Indonesia Raya, merdeka, merdeka!\nHiduplah Indonesia Raya" },
];

const hariMerdekaLyrics = [
    { startTime: 13.5, endTime: 16.7, text: "Tujuh belas Agustus tahun empat lima" },
    { startTime: 16.8, endTime: 20.4, text: "Itulah hari kemerdekaan kita" },
    { startTime: 20.5, endTime: 23.9, text: "Hari merdeka nusa dan bangsa" },
    { startTime: 24.0, endTime: 27.4, text: "Hari lahirnya bangsa Indonesia" },
    { startTime: 27.5, endTime: 29.7, text: "Merdeka!" },
    { startTime: 29.8, endTime: 33.4, text: "Sekali merdeka tetap merdeka" },
    { startTime: 33.5, endTime: 37.4, text: "Selama hayat masih dikandung badan" },
    { startTime: 37.5, endTime: 40.9, text: "Kita tetap setia tetap sedia" },
    { startTime: 41.0, endTime: 44.4, text: "Mempertahankan Indonesia" },
    { startTime: 44.5, endTime: 47.9, text: "Kita tetap setia tetap sedia" },
    { startTime: 48.0, endTime: 51.5, text: "Membela negara kita" },
];


const songData = {
    tanahAirku: {
        title: "TANAH AIRKU",
        lyrics: tanahAirkuLyrics,
        src: 'https://files.catbox.moe/8a4iu0.mp3'
    },
    indonesiaRaya: {
        title: "INDONESIA RAYA",
        lyrics: indonesiaRayaLyrics,
        src: 'https://files.catbox.moe/m2jk0k.mp3'
    },
    hariMerdeka: {
        title: "HARI MERDEKA",
        lyrics: hariMerdekaLyrics,
        src: 'https://files.catbox.moe/7vvoj8.mp3'
    }
}

type SongKey = keyof typeof songData;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};


const App: React.FC = () => {
    // Core State
    const [currentSong, setCurrentSong] = useState<SongKey | null>(null);
    const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
    
    // Effects State
    const [fireworksTrigger, setFireworksTrigger] = useState<number>(0);
    const [confettiTriggers, setConfettiTriggers] = useState<ConfettiTrigger[]>([]);
    const [isGarudaGlowing, setIsGarudaGlowing] = useState(false);

    // AI Corner State
    const [aiResponse, setAiResponse] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [aiError, setAiError] = useState<string | null>(null);

    // Feature State
    const [isPhotoBoothVisible, setIsPhotoBoothVisible] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    
    useEffect(() => {
        if (isGenerating) {
            setIsGarudaGlowing(true);
        } else {
            const timer = setTimeout(() => setIsGarudaGlowing(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isGenerating]);

    const triggerConfetti = (e: React.MouseEvent) => {
        setConfettiTriggers(triggers => [...triggers, { x: e.clientX, y: e.clientY, id: Date.now() }]);
    };
    
    const playSong = useCallback((songKey: SongKey) => {
        const audio = audioRef.current;
        if (!audio) return;
        
        stopSong();

        setCurrentSong(songKey);
        audio.src = songData[songKey].src;
        audio.play().catch(e => console.error("Error playing audio:", e));
    }, []);

    const stopSong = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        setCurrentSong(null);
        setCurrentLyricIndex(-1);
    }, []);

    const handlePlaySequence = (e: React.MouseEvent) => {
        triggerConfetti(e);
        playSong('tanahAirku');
    };

    const handleStopSong = (e: React.MouseEvent) => {
        triggerConfetti(e);
        stopSong();
    };

    const handleSongEnd = () => {
        if (currentSong === 'tanahAirku') {
            playSong('indonesiaRaya');
        } else if (currentSong === 'indonesiaRaya') {
            playSong('hariMerdeka');
        } else {
            stopSong();
        }
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current || !currentSong) return;
        const currentTime = audioRef.current.currentTime;
        const currentLyrics = songData[currentSong].lyrics;
        const activeLyricIndex = currentLyrics.findIndex(
            line => currentTime >= line.startTime && currentTime <= line.endTime
        );
        if (activeLyricIndex !== -1 && activeLyricIndex !== currentLyricIndex) {
            setCurrentLyricIndex(activeLyricIndex);
        }
    };

    const handleFireworkClick = (e: React.MouseEvent) => {
        triggerConfetti(e);
        setFireworksTrigger(prev => prev + 1);
    };

    const handleGenerateContent = async (prompt: string) => {
        if (!process.env.API_KEY) {
            setAiError("API Key is not configured.");
            return;
        }
        setIsGenerating(true);
        setAiResponse('');
        setAiError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const responseStream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: "You are a patriotic AI celebrating Indonesian Independence Day. All your responses must be positive, uplifting, and themed around Indonesia's independence, using beautiful and formal Indonesian language. Provide detailed and well-structured answers. If asked for a poem, make it rich with imagery. If asked for a story, include context and key moments.",
                }
            });
            
            for await (const chunk of responseStream) {
                setAiResponse(prev => prev + chunk.text);
            }

        } catch (e: any) {
            console.error(e);
            setAiError(e.message || "Failed to generate content.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const isSongPlaying = currentSong !== null;

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden text-center text-slate-200 bg-hero-pattern">
            <FireworksCanvas trigger={fireworksTrigger} />
            <ParticleBackground />
            <Confetti triggers={confettiTriggers} />
             <AnimatePresence>
                {isPhotoBoothVisible && <PhotoBooth onClose={() => setIsPhotoBoothVisible(false)} />}
            </AnimatePresence>
             <AnimatePresence>
                {isSongPlaying && (
                    <LyricOverlay 
                        title={songData[currentSong].title}
                        lyrics={songData[currentSong].lyrics}
                        onClose={handleStopSong}
                        currentLineIndex={currentLyricIndex}
                    />
                )}
            </AnimatePresence>

            <div className="relative z-10 mx-auto flex min-h-screen flex-col items-center p-4 pt-20 sm:p-6 md:p-8">
                <Garuda isGlowing={isGarudaGlowing} />
                <main className="flex w-full flex-col items-center justify-center">
                     <motion.div 
                        className="w-full text-center"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}><Header /></motion.div>
                        <motion.div variants={itemVariants}><Flag /></motion.div>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="relative w-full max-w-4xl p-6 sm:p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50"
                        >
                            <motion.div 
                                variants={containerVariants}
                                className="my-8 flex flex-wrap items-center justify-center gap-4"
                            >
                                <motion.div variants={itemVariants}>
                                    <ActionButton onClick={handlePlaySequence} disabled={isSongPlaying}>
                                       Menyanyikan Lagu Kebangsaan 
                                    </ActionButton>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <ActionButton onClick={handleFireworkClick}>
                                        Nyalakan Kembang Api
                                    </ActionButton>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <ActionButton onClick={() => setIsPhotoBoothVisible(true)}>
                                        Ambil Foto Kenangan
                                    </ActionButton>
                                </motion.div>
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="decorative-divider"></motion.div>
                            
                            <motion.div variants={itemVariants}>
                                <AICorner
                                    onGenerate={handleGenerateContent}
                                    isGenerating={isGenerating}
                                    response={aiResponse}
                                    error={aiError}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </main>
            </div>
            
            <footer className="absolute bottom-4 left-0 right-0 z-20 text-center text-xs text-slate-400/80 transition-colors hover:text-slate-200">
                <p>© Maulana Developer</p> 
            </footer>

            <audio ref={audioRef} onEnded={handleSongEnd} onTimeUpdate={handleTimeUpdate}></audio>
        </div>
    );
};

export default App;