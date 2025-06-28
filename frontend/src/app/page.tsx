import React from 'react';
import { Card } from '@/components/card';
import { EtheralShadow } from '@/components/etheral-shadow';

export default function DecentraPingLanding() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Background with EtheralShadow */}
            <div className="absolute top-0 left-0 w-full h-full">
                <EtheralShadow
                    color="rgba(59, 130, 246, 0.1)"
                    animation={{ scale: 100, speed: 90 }}
                    noise={{ opacity: 1, scale: 1.2 }}
                    className="absolute w-full h-full"
                />
            </div>

            {/* Hero Section */}
            <section className="relative top-0 left-0 w-full h-screen overflow-hidden flex items-center">


                <div className="relative container mx-auto px-6 py-20 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent leading-tight">
                            DecentraPing
                        </h1>

                        <p className="text-xl lg:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            The first <span className="text-blue-400 font-semibold">decentralized website monitoring</span> platform powered by blockchain.
                            Transparent, censorship-resistant, and unstoppable uptime tracking.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <a className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                href="/user/login">
                                <span className="flex items-center justify-center gap-2">
                                    Monitor Your Site
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </a>
                            <a className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-xl font-semibold text-white backdrop-blur-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                href="/validator/login">
                                Become a Validator
                            </a>
                        </div>

                        <div className="relative mx-auto max-w-2xl">
                            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl border border-slate-600/50 p-8 shadow-2xl">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-400">99.9%</div>
                                        <div className="text-sm text-slate-400">Uptime</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400">47ms</div>
                                        <div className="text-sm text-slate-400">Response</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-300">24/7</div>
                                        <div className="text-sm text-slate-400">Monitoring</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-slate-800/30 backdrop-blur-sm">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose DecentraPing?</h2>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Experience the future of website monitoring with blockchain-powered transparency and reliability
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card
                            icon="⚡"
                            title="Real-time Monitoring"
                            description="Continuous uptime and performance monitoring with instant alerts when issues are detected."
                        />
                        <Card
                            icon="🔒"
                            title="Blockchain Security"
                            description="Tamper-proof monitoring records stored on Solana blockchain for ultimate transparency."
                        />
                        <Card
                            icon="🌐"
                            title="Decentralized Network"
                            description="Global network of independent validators ensures no single point of failure or censorship."
                        />
                        <Card
                            icon="🛡️"
                            title="Security Checks"
                            description="Comprehensive security scanning including SSL, malware detection, and vulnerability assessment."
                        />
                        <Card
                            icon="💎"
                            title="Earn Rewards"
                            description="Validators earn tokens for honest monitoring while users get reliable, incentivized service."
                        />
                        <Card
                            icon="📊"
                            title="Analytics Dashboard"
                            description="Detailed performance analytics and historical data with beautiful, actionable insights."
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-3xl p-8 lg:p-12 border border-slate-600/30 backdrop-blur-sm">
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">1,000+</div>
                                <div className="text-slate-300">Websites Monitored</div>
                            </div>
                            <div>
                                <div className="text-3xl lg:text-4xl font-bold text-blue-300 mb-2">50+</div>
                                <div className="text-slate-300">Active Validators</div>
                            </div>
                            <div>
                                <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2">99.9%</div>
                                <div className="text-slate-300">Network Uptime</div>
                            </div>
                            <div>
                                <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">24/7</div>
                                <div className="text-slate-300">Monitoring</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-slate-800/30 to-slate-700/30">
                <div className="container mx-auto max-w-4xl text-center">
                    <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                        Ready to Secure Your Web Presence?
                    </h3>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Join the decentralized monitoring revolution. Monitor your websites with unprecedented transparency and reliability.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                            <span className="flex items-center justify-center gap-2">
                                Start Monitoring Now
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>
                        <button className="px-10 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-xl font-semibold text-white backdrop-blur-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                                DecentraPing
                            </span>
                        </div>
                        <div className="text-slate-400 text-sm">
                            © {new Date().getFullYear()} DecentraPing. Built at Hacksagon Hackathon. Powered by Solana.
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}