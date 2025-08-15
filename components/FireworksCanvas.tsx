
import React, { useRef, useEffect } from 'react';

interface FireworksCanvasProps {
    trigger: number;
}

class Firework {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    color: string;
    distance: number;
    angle: number;
    speed: number;
    particles: any[];
    alive: boolean;
    size: number;
    explosionType: number;

    constructor(x: number, y: number, targetX: number, targetY: number) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = this.getRandomColor();
        this.distance = Math.sqrt(Math.pow(this.targetX - this.x, 2) + Math.pow(this.targetY - this.y, 2));
        this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        this.speed = 2 + Math.random() * 2;
        this.particles = [];
        this.alive = true;
        this.size = 3 + Math.random() * 2;
        this.explosionType = Math.floor(Math.random() * 3);
    }

    getRandomColor() {
        const redShades = ['#ff0000', '#e60000', '#cc0000', '#ff3333'];
        const whiteShades = ['#ffffff', '#f0f0f0', '#e6e6e6'];
        const colors = [...redShades, ...whiteShades];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        if (this.distance > 0) {
            const vx = Math.cos(this.angle) * this.speed;
            const vy = Math.sin(this.angle) * this.speed;
            this.x += vx;
            this.y += vy;
            this.distance -= this.speed;

            this.particles.push({
                x: this.x, y: this.y, color: this.color, alpha: 0.7,
                size: this.size * 0.7, decay: 0.03,
            });
        } else {
            this.explode();
            this.alive = false;
        }
        this.updateParticles(this.particles.filter(p => !p.vx));
    }
    
    explode() {
        const particleCount = 60 + Math.random() * 60;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 5;
            this.particles.push({
                x: this.x, y: this.y,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                color: this.color, alpha: 1, size: 1 + Math.random() * 2,
                decay: Math.random() * 0.02 + 0.01, gravity: 0.02 + Math.random() * 0.03,
            });
        }
    }

    updateParticles(particles: any[]) {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            if (p.vx) { // Explosion particle
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
            } else { // Trail particle
                p.size *= 0.98;
            }
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        // Draw trail
        this.particles.filter(p => !p.vx).forEach(p => {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw rocket
        if (this.distance > 0) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw explosion
        this.particles.filter(p => p.vx).forEach(p => {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}


const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ trigger }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fireworksRef = useRef<Firework[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const gameLoop = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const currentFireworks = fireworksRef.current;
            for (let i = currentFireworks.length - 1; i >= 0; i--) {
                const fw = currentFireworks[i];
                if(fw.alive) {
                    fw.update();
                }
                fw.updateParticles(fw.particles.filter(p => p.vx));
                fw.draw(ctx);
                if (!fw.alive && fw.particles.length === 0) {
                    currentFireworks.splice(i, 1);
                }
            }

            animationFrameId = window.requestAnimationFrame(gameLoop);
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        gameLoop();
        
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);
    
    useEffect(() => {
        if (trigger > 0) {
             const canvas = canvasRef.current;
             if (!canvas) return;
             
             // Launch a volley of fireworks
             const volleyCount = 5 + Math.floor(Math.random() * 5);
             for(let i = 0; i < volleyCount; i++) {
                setTimeout(() => {
                     const startX = Math.random() * canvas.width;
                     const startY = canvas.height;
                     const targetX = startX + (Math.random() - 0.5) * 400;
                     const targetY = canvas.height * 0.1 + Math.random() * canvas.height * 0.3;
                     fireworksRef.current.push(new Firework(startX, startY, targetX, targetY));
                }, Math.random() * 500);
             }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger]);


    return <canvas ref={canvasRef} className="fixed top-0 left-0 z-0 h-full w-full pointer-events-none" />;
};

export default FireworksCanvas;
