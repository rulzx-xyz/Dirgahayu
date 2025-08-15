import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ActionButton from './ActionButton';

interface PhotoBoothProps {
    onClose: () => void;
}

const ShutterIcon: React.FC = () => (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 8V16C2 17.1046 2.89543 18 4 18H20C21.1046 18 22 17.1046 22 16V8C22 6.89543 21.1046 6 20 6H4C2.89543 6 2 6.89543 2 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M12 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
    </svg>
);


const PhotoBooth: React.FC<PhotoBoothProps> = ({ onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedFrame, setSelectedFrame] = useState<string>('frame1');
    const [isCameraLoading, setIsCameraLoading] = useState<boolean>(true);
    const [flash, setFlash] = useState(false);

    const frames: { [key: string]: { name: string, draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void } } = {
        frame1: {
            name: "Dirgahayu 80",
            draw: (ctx, width, height) => {
                ctx.fillStyle = 'rgba(204, 26, 23, 0.85)';
                ctx.fillRect(0, height - 80, width, 80);
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 36px Montserrat, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0,0,0,0.7)';
                ctx.shadowBlur = 6;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillText('DIRGAHAYU RI KE-80', width / 2, height - 55);
                
                ctx.font = 'italic 20px Poppins, sans-serif';
                ctx.fillStyle = '#FFD700'; // Gold color
                ctx.fillText('Menuju Indonesia Emas 2045', width / 2, height - 25);
                
                ctx.shadowColor = 'transparent';
            },
        },
        frame2: {
            name: "Merah Putih",
            draw: (ctx, width, height) => {
                ctx.fillStyle = '#E31D1A'; // Red
                ctx.fillRect(0, 0, width, height * 0.1);
                ctx.fillStyle = '#FFFFFF'; // White
                ctx.fillRect(0, height * 0.9, width, height * 0.1);
            },
        },
        frame3: {
            name: "Semangat",
            draw: (ctx, width, height) => {
                ctx.font = 'bold 48px Montserrat, sans-serif';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = 'white';
                ctx.shadowColor = '#E31D1A';
                ctx.shadowBlur = 8;
                ctx.fillText('MERDEKA!', width - 20, height - 20);
                ctx.shadowColor = 'transparent';
            }
        }
    };

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const startCamera = useCallback(async () => {
        stopCamera();
        setIsCameraLoading(true);
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            setError("Izin kamera ditolak. Mohon izinkan akses kamera di pengaturan browser Anda.");
        } finally {
            setIsCameraLoading(false);
        }
    }, [stopCamera]);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    const takePicture = () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        setFlash(true);
        setTimeout(() => setFlash(false), 300);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { videoWidth, videoHeight } = video;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        ctx.translate(videoWidth, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        frames[selectedFrame].draw(ctx, videoWidth, videoHeight);

        setCapturedImage(canvas.toDataURL('image/png'));
        stopCamera();
    };

    const downloadPicture = () => {
        if (!capturedImage) return;
        const link = document.createElement('a');
        link.href = capturedImage;
        link.download = 'fotoku-dirgahayu-ri-80.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const retakePicture = () => {
        setCapturedImage(null);
        startCamera();
    };

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
                className="relative flex w-11/12 max-w-4xl flex-col rounded-2xl border-2 border-yellow-300 bg-gradient-to-br from-red-950/90 to-black/80 p-4 shadow-2xl shadow-yellow-500/30 sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-700 text-white transition-transform hover:scale-110" aria-label="Tutup">
                    &times;
                </button>
                <h3 className="font-montserrat mb-4 text-center text-2xl font-bold text-yellow-300 text-shadow-highlight">
                    Pojok Foto Kemerdekaan
                </h3>

                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                    {flash && <div className="absolute inset-0 z-20 bg-white opacity-70 animate-ping"></div>}
                    {capturedImage ? (
                         <img src={capturedImage} alt="Foto yang telah diambil" className="h-full w-full object-contain" />
                    ) : (
                         <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover scale-x-[-1]"></video>
                    )}
                    {isCameraLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/70"><p>Membuka kamera...</p></div>}
                     {error && <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 text-center text-red-400">{error}</div>}
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>
                
                {capturedImage ? (
                    <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <ActionButton onClick={retakePicture}>Ulangi</ActionButton>
                        <ActionButton onClick={downloadPicture}>Unduh Foto</ActionButton>
                        <ActionButton onClick={onClose} variant="secondary">Selesai</ActionButton>
                    </div>
                ) : (
                    <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex flex-wrap justify-center gap-2">
                             {Object.entries(frames).map(([key, { name }]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedFrame(key)}
                                    className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                                        selectedFrame === key 
                                        ? 'border-yellow-300 bg-yellow-300 text-red-800' 
                                        : 'border-white/50 bg-transparent text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    Bingkai: {name}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={takePicture} 
                            disabled={isCameraLoading || !!error}
                            className="group flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-red-700 text-white transition-all duration-300 hover:scale-110 hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-500"
                            aria-label="Ambil foto"
                        >
                            <ShutterIcon />
                        </button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default PhotoBooth;