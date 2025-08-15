import React from 'react';
import { motion } from 'framer-motion';

interface ActionButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, disabled = false, variant = 'primary' }) => {
    const isPrimary = variant === 'primary';

    const buttonVariantClasses = isPrimary
        ? 'bg-gradient-to-br from-red-700 to-yellow-400 group-hover:from-red-700 group-hover:to-yellow-400 focus:ring-red-800'
        : 'bg-gradient-to-br from-slate-500 to-slate-400 group-hover:from-slate-500 group-hover:to-slate-400 focus:ring-slate-500';

    const spanVariantClasses = isPrimary ? 'bg-slate-900' : 'bg-slate-700';

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={`relative inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-bold text-white rounded-full group disabled:cursor-not-allowed focus:ring-4 focus:outline-none ${buttonVariantClasses}`}
        >
            <span className={`relative px-8 py-3 transition-all ease-in duration-150 rounded-full group-hover:bg-opacity-90 disabled:bg-gray-600 ${spanVariantClasses}`}>
                {children}
            </span>
        </motion.button>
    );
};

export default ActionButton;
