'use client'

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface CardProps {
    icon?: string;
    title: string;
    description: string;
    className?: string;
}

export function Card({ icon = "⚡", title, description, className = "" }: CardProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // For 3D card effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            className={`relative ${className}`}
            style={{ perspective: 1500, rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ z: 10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="relative group">
                {/* Card glow effect */}
                <motion.div 
                    className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
                    animate={{
                        boxShadow: [
                            "0 0 10px 2px rgba(255,255,255,0.03)",
                            "0 0 15px 5px rgba(255,255,255,0.05)",
                            "0 0 10px 2px rgba(255,255,255,0.03)"
                        ],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut", 
                        repeatType: "mirror" 
                    }}
                />

                {/* Traveling light beam effect */}
                <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
                    {/* Top light beam */}
                    <motion.div 
                        className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                        initial={{ filter: "blur(2px)" }}
                        animate={{ 
                            left: ["-50%", "100%"],
                            opacity: [0.3, 0.7, 0.3],
                            filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                        }}
                        transition={{ 
                            left: {
                                duration: 2.5, 
                                ease: "easeInOut", 
                                repeat: Infinity,
                                repeatDelay: 1
                            },
                            opacity: {
                                duration: 1.2,
                                repeat: Infinity,
                                repeatType: "mirror"
                            },
                            filter: {
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "mirror"
                            }
                        }}
                    />
                    
                    {/* Right light beam */}
                    <motion.div 
                        className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                        initial={{ filter: "blur(2px)" }}
                        animate={{ 
                            top: ["-50%", "100%"],
                            opacity: [0.3, 0.7, 0.3],
                            filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                        }}
                        transition={{ 
                            top: {
                                duration: 2.5, 
                                ease: "easeInOut", 
                                repeat: Infinity,
                                repeatDelay: 1,
                                delay: 0.6
                            },
                            opacity: {
                                duration: 1.2,
                                repeat: Infinity,
                                repeatType: "mirror",
                                delay: 0.6
                            },
                            filter: {
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "mirror",
                                delay: 0.6
                            }
                        }}
                    />
                    
                    {/* Bottom light beam */}
                    <motion.div 
                        className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                        initial={{ filter: "blur(2px)" }}
                        animate={{ 
                            right: ["-50%", "100%"],
                            opacity: [0.3, 0.7, 0.3],
                            filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                        }}
                        transition={{ 
                            right: {
                                duration: 2.5, 
                                ease: "easeInOut", 
                                repeat: Infinity,
                                repeatDelay: 1,
                                delay: 1.2
                            },
                            opacity: {
                                duration: 1.2,
                                repeat: Infinity,
                                repeatType: "mirror",
                                delay: 1.2
                            },
                            filter: {
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "mirror",
                                delay: 1.2
                            }
                        }}
                    />
                    
                    {/* Left light beam */}
                    <motion.div 
                        className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                        initial={{ filter: "blur(2px)" }}
                        animate={{ 
                            bottom: ["-50%", "100%"],
                            opacity: [0.3, 0.7, 0.3],
                            filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                        }}
                        transition={{ 
                            bottom: {
                                duration: 2.5, 
                                ease: "easeInOut", 
                                repeat: Infinity,
                                repeatDelay: 1,
                                delay: 1.8
                            },
                            opacity: {
                                duration: 1.2,
                                repeat: Infinity,
                                repeatType: "mirror",
                                delay: 1.8
                            },
                            filter: {
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "mirror",
                                delay: 1.8
                            }
                        }}
                    />
                    
                    {/* Corner glow spots */}
                    <motion.div 
                        className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-white/40 blur-[1px]"
                        animate={{ 
                            opacity: [0.2, 0.4, 0.2] 
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            repeatType: "mirror"
                        }}
                    />
                    <motion.div 
                        className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-white/60 blur-[2px]"
                        animate={{ 
                            opacity: [0.2, 0.4, 0.2] 
                        }}
                        transition={{ 
                            duration: 2.4, 
                            repeat: Infinity,
                            repeatType: "mirror",
                            delay: 0.5
                        }}
                    />
                    <motion.div 
                        className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-white/60 blur-[2px]"
                        animate={{ 
                            opacity: [0.2, 0.4, 0.2] 
                        }}
                        transition={{ 
                            duration: 2.2, 
                            repeat: Infinity,
                            repeatType: "mirror",
                            delay: 1
                        }}
                    />
                    <motion.div 
                        className="absolute bottom-0 left-0 h-[5px] w-[5px] rounded-full bg-white/40 blur-[1px]"
                        animate={{ 
                            opacity: [0.2, 0.4, 0.2] 
                        }}
                        transition={{ 
                            duration: 2.3, 
                            repeat: Infinity,
                            repeatType: "mirror",
                            delay: 1.5
                        }}
                    />
                </div>

                {/* Card border glow */}
                <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/3 via-white/7 to-white/3 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                
                {/* Glass card background */}
                <div className="relative bg-black-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.05] shadow-2xl overflow-hidden">
                    {/* Subtle card inner patterns */}
                    <div className="absolute inset-0 opacity-[0.03]" 
                        style={{
                            backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                            backgroundSize: '30px 30px'
                        }}
                    />

                    {/* Icon container */}
                    <motion.div 
                        className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300 relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <span className="text-2xl relative z-10">{icon}</span>
                        
                        {/* Icon container glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                        
                        {/* Icon highlight effect */}
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                            animate={{ 
                                x: ['-100%', '100%'],
                            }}
                            transition={{ 
                                duration: 2, 
                                ease: "easeInOut", 
                                repeat: Infinity,
                                repeatDelay: 2
                            }}
                        />
                    </motion.div>
                    
                    {/* Title */}
                    <motion.h3 
                        className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {title}
                    </motion.h3>
                    
                    {/* Description */}
                    <motion.p 
                        className="text-white/60 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {description}
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
}

// Demo component to show the card in action
export default function CardDemo() {
    return (
        <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center p-8">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />
            
            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                }}
            />

            {/* Background glows */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />
            <motion.div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-purple-300/20 blur-[60px]"
                animate={{ 
                    opacity: [0.15, 0.3, 0.15],
                    scale: [0.98, 1.02, 0.98]
                }}
                transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: "mirror"
                }}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl relative z-10">
                <Card 
                    icon="⚡"
                    title="Lightning Fast"
                    description="Experience blazing fast performance with our optimized infrastructure that delivers content at the speed of light."
                />
                <Card 
                    icon="🛡️"
                    title="Secure by Design"
                    description="Your data is protected with enterprise-grade security measures and end-to-end encryption protocols."
                />
                <Card 
                    icon="🚀"
                    title="Scale Infinitely"
                    description="Grow your business without limits. Our platform scales automatically to meet your growing demands."
                />
            </div>
        </div>
    );
}