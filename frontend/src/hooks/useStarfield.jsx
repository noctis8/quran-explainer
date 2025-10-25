import {useEffect, useRef} from "react";

export function useStarfield() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Star properties
        const stars = [];
        const numStars = 40;

        // Create stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }

        // Floating orbs
        const orbs = [];
        const numOrbs = 6;

        for (let i = 0; i < numOrbs; i++) {
            orbs.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.2 + 0.05,
                hue: Math.random() * 40 + 200 // Blue range
            });
        }

        let time = 0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.016;

            // Draw and animate stars
            stars.forEach((star) => {
                // Move stars
                star.x -= star.speed;
                if (star.x < -10) {
                    star.x = canvas.width + 10;
                    star.y = Math.random() * canvas.height;
                }

                // Twinkling effect
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
                const currentOpacity = star.opacity * (0.6 + 0.4 * twinkle);

                // Draw star
                ctx.save();
                ctx.globalAlpha = currentOpacity;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Add subtle glow
                ctx.globalAlpha = currentOpacity * 0.2;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Draw and animate floating orbs
            orbs.forEach(orb => {
                // Move orbs
                orb.x += orb.speedX;
                orb.y += orb.speedY;

                // Bounce off edges
                if (orb.x < 0 || orb.x > canvas.width) orb.speedX *= -1;
                if (orb.y < 0 || orb.y > canvas.height) orb.speedY *= -1;

                // Keep orbs in bounds
                orb.x = Math.max(0, Math.min(canvas.width, orb.x));
                orb.y = Math.max(0, Math.min(canvas.height, orb.y));

                // Pulsing effect
                const pulse = Math.sin(time * 1.5 + orb.x * 0.01) * 0.3 + 0.7;
                const currentSize = orb.size * pulse;

                // Draw orb with gradient
                const gradient = ctx.createRadialGradient(
                    orb.x, orb.y, 0,
                    orb.x, orb.y, currentSize * 3
                );
                gradient.addColorStop(0, `hsla(${orb.hue}, 60%, 70%, ${orb.opacity})`);
                gradient.addColorStop(1, `hsla(${orb.hue}, 60%, 70%, 0)`);

                ctx.save();
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, currentSize * 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    return canvasRef
}