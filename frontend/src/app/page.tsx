import React from 'react';

export default function DecentraPingLanding() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative container mx-auto px-6 py-20 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 backdrop-blur-sm mb-8">
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAzNzYgMjM2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iMzY4IiBoZWlnaHQ9IjIyOCIgcng9IjIwIiBzdHJva2U9IiMyMkM1NUUiIHN0cm9rZS13aWR0aD0iOCIvPgo8cmVjdCB4PSIyNCIgeT0iMjQiIHdpZHRoPSIyNDAiIGhlaWdodD0iMTQ0IiByeD0iNCIgZmlsbD0id2hpdGUiLz4KPHN2ZyB4PSIzMDAiIHk9IjMwIiB3aWR0aD0iNjAiIGhlaWdodD0iMTMyIj4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSIjMjJDNTVFIi8+CjxyZWN0IHg9IjAiIHk9IjE2IiB3aWR0aD0iNTYiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9IiMyMkM1NUUiLz4KPHJlY3QgeD0iMCIgeT0iMzIiIHdpZHRoPSI1NiIgaGVpZ2h0PSI4IiByeD0iNCIgZmlsbD0iIzIyQzU1RSIvPgo8cmVjdCB4PSIwIiB5PSI0OCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSIjMjJDNTVFIi8+CjxyZWN0IHg9IjAiIHk9IjY0IiB3aWR0aD0iNTYiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9IiMyMkM1NUUiLz4KPC9zdmc+CjxjaXJjbGUgY3g9IjI1NiIgY3k9Ijc2IiByPSI4IiBmaWxsPSIjMjJDNTVFIi8+CjxwYXRoIGQ9Ik0xMzYgMTI0TDE5MiA4MEwyNTYgNzZMMzIwIDUyIiBzdHJva2U9IiMyMkM1NUUiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPgo8cmVjdCB4PSIxMDQiIHk9IjE4NCIgd2lkdGg9IjE2OCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSIjMjJDNTVFIi8+Cjwvc3ZnPgo=" alt="Monitoring icon" className="w-4 h-4 mr-2" />
                            <span className="text-blue-300 text-sm font-medium">Built on Solana • Decentralized Monitoring</span>
                        </div>

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

                        {/* Dashboard Preview */}
                        <div className="relative mx-auto max-w-2xl">
                            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl border border-slate-600/50 p-8 shadow-2xl">
                                <div className="grid grid-cols-3 gap-4 mt-6">
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
                        {/* Feature Card 1 */}
                        <div className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-400">Real-time Monitoring</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Continuous uptime and performance monitoring with instant alerts when issues are detected.
                            </p>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                                <span className="text-2xl">🔒</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-300">Blockchain Security</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Tamper-proof monitoring records stored on Solana blockchain for ultimate transparency.
                            </p>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                                <span className="text-2xl">🌐</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-green-400">Decentralized Network</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Global network of validators ensures no single point of failure or censorship.
                            </p>
                        </div>

                        {/* Feature Card 4 */}
                        <div className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-400/30 transition-colors">
                                <span className="text-2xl">🛡️</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-300">Security Checks</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Comprehensive security scanning including SSL, malware detection, and vulnerability assessment.
                            </p>
                        </div>

                        {/* Feature Card 5 */}
                        <div className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                                <span className="text-2xl">💎</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-400">Earn Rewards</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Validators earn tokens for honest monitoring while users get reliable, incentivized service.
                            </p>
                        </div>

                        {/* Feature Card 6 */}
                        <div className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-400/30 transition-colors">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-300">Analytics Dashboard</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Detailed performance analytics and historical data with beautiful, actionable insights.
                            </p>
                        </div>
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