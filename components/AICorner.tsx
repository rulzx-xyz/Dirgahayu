import React, { useState } from 'react';
import Loader from './Loader';
import AIResponse from './AIResponse';
import { motion } from 'framer-motion';

interface AICornerProps {
    onGenerate: (prompt: string) => void;
    isGenerating: boolean;
    response: string;
    error: string | null;
}

const AICorner: React.FC<AICornerProps> = ({ onGenerate, isGenerating, response, error }) => {
    const [prompt, setPrompt] = useState('');

    const suggestedPrompts = [
        'Buatkan puisi tentang pahlawan',
        'Tulis ucapan Dirgahayu RI ke-80',
        'Ceritakan perjuangan Indonesia',
        'Sebutkan proklamasi soekarno',
        'Sebutkan nama nama pahlawan indnesia',
    ];

    const handleSubmit = () => {
        if (prompt.trim() && !isGenerating) {
            onGenerate(prompt);
        }
    };

    const handleSuggestedPrompt = (suggested: string) => {
        setPrompt(suggested);
        onGenerate(suggested);
    };

    return (
        <div className="w-full mt-8">
            <h3 className="font-montserrat text-2xl font-bold tracking-wider text-yellow-300 text-glow-gold sm:text-3xl">
                Suarakan Semangatmu dengan AI
            </h3>
            <p className="mt-2 text-slate-300 text-glow-white">
                Minta AI untuk membuat puisi, ucapan, atau cerita singkat tentang kemerdekaan Indonesia!
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {suggestedPrompts.map(p => (
                     <motion.button 
                        key={p} 
                        onClick={() => handleSuggestedPrompt(p)}
                        disabled={isGenerating}
                        className="px-4 py-2 text-sm bg-white/10 border border-white/20 text-slate-200 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: isGenerating ? 1 : 1.05 }}
                        whileTap={{ scale: isGenerating ? 1 : 0.95 }}
                    >
                        {p}
                    </motion.button>
                ))}
            </div>

            <div className="mt-6 flex flex-col items-stretch gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Contoh: Buatkan doa untuk para pahlawan Indonesia..."
                    className="w-full rounded-md border border-slate-600/50 bg-slate-800/50 p-3 text-white placeholder-slate-400 transition-colors focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    rows={3}
                    disabled={isGenerating}
                />
                 <div className="flex justify-end">
                    <motion.button
                        onClick={handleSubmit}
                        disabled={isGenerating || !prompt.trim()}
                        className="px-8 py-3 text-base font-bold bg-gradient-to-br from-red-700 to-yellow-400 text-white rounded-full hover:from-red-600 hover:to-yellow-300 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-500"
                        whileHover={{ scale: isGenerating || !prompt.trim() ? 1 : 1.05 }}
                        whileTap={{ scale: isGenerating || !prompt.trim() ? 1 : 0.95 }}
                    >
                        {isGenerating ? 'Sedang Mencipta...' : 'Hasilkan Karya'}
                    </motion.button>
                </div>
            </div>
            
            {isGenerating && !response && <Loader />}
            {error && <p className="mt-4 text-red-400">Terjadi kesalahan: {error}</p>}
            {(response || (isGenerating && response)) && <AIResponse text={response} isGenerating={isGenerating} />}

        </div>
    );
};

export default AICorner;