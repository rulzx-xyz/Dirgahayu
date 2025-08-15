import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AIResponseProps {
    text: string;
    isGenerating: boolean;
}

const AIResponse: React.FC<AIResponseProps> = ({ text, isGenerating }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if(isGenerating) {
            setCopied(false);
        }
    }, [isGenerating]);

    const handleCopy = () => {
        if (isGenerating || !text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 rounded-xl bg-gradient-to-br from-slate-900/70 to-slate-800/60 p-5 border-2 border-yellow-400/50 relative backdrop-blur-sm shadow-lg shadow-yellow-500/10"
        >
            <h4 className="text-lg font-bold text-yellow-300 text-shadow-highlight">Hasil Karya AI:</h4>
            <p className="whitespace-pre-wrap py-4 text-left text-white/90 text-shadow-lyrics">
                {text}
                {isGenerating && <span className="animate-blink-caret" />}
            </p>
            <button
                onClick={handleCopy}
                disabled={isGenerating || !text}
                className="absolute top-3 right-3 rounded-md bg-yellow-300/80 px-3 py-1 text-sm font-bold text-red-800 transition-all hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-yellow-300/40"
            >
                {copied ? 'Tersalin!' : 'Salin'}
            </button>
        </motion.div>
    );
};

export default AIResponse;