"use client"

import React, { useState, useEffect } from 'react';
import { Wallet, Copy, Check, Shield, Zap, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ValidatorPortal() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [phantom, setPhantom] = useState<any>(null);

    useEffect(() => {
        const getProvider = () => {
            if (typeof window !== 'undefined' && 'phantom' in window) {
                const provider = (window as any).phantom?.solana;
                if (provider?.isPhantom) {
                return provider;
                }
            }
            return null;
        };

        const provider = getProvider();
        if (provider) {
        setPhantom(provider);
        
        // Check if already connected
        if (provider.isConnected) {
            setWalletAddress(provider.publicKey?.toString() || null);
        }
        }
    }, []);

    const handleConnectWallet = async () => {
        if (!phantom) {
            // If phantom is not detected, show error instead of redirecting
            alert('Phantom wallet not detected. Please install the Phantom browser extension.');
            return;
        }

        setIsConnecting(true);
        
        try {
        const response = await phantom.connect();
        if (response.publicKey) {
            setWalletAddress(response.publicKey.toString());
        }
        } catch (err: any) {
        console.error('Failed to connect wallet:', err);
        if (err.code === 4001) {
            // User rejected the request
            alert('Connection cancelled by user');
        } else {
            alert('Failed to connect wallet. Please try again.');
        }
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (phantom && walletAddress) {
            try {
                await phantom.disconnect();
                setWalletAddress(null);
            } catch (err) {
                console.error('Failed to disconnect wallet:', err);
            }
        }
    };

    const copyAddress = () => {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-6)}`;
    };

    // SVG component for the monitoring icon
    const MonitoringIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
            <rect x="4" y="6" width="12" height="8" rx="1" fill="currentColor" fillOpacity="0.1"/>
            <path d="M6 10L10 8L14 12L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="8" r="1.5" fill="currentColor"/>
            <rect x="16" y="7" width="1" height="1" fill="currentColor"/>
            <rect x="16" y="9" width="1" height="1" fill="currentColor"/>
            <rect x="16" y="11" width="1" height="1" fill="currentColor"/>
            <rect x="9" y="18" width="6" height="2" rx="1" fill="currentColor"/>
            <rect x="7" y="20" width="10" height="1" rx="0.5" fill="currentColor"/>
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-10 right-1/4 w-48 h-48 bg-green-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
            </div>

            {/* Floating Header */}
            <header className="relative z-10 px-6 pt-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between">
                        {/* Logo with glow effect */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
                            <div className="relative px-6 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-600/40 rounded-2xl">
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                                    DecentraPing
                                </span>
                                <span className="text-slate-400 ml-2 text-sm">Validator</span>
                            </div>
                        </div>
                        
                        {/* Status indicators */}
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-lg"></div>
                                <div className="relative px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-green-500/30 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-green-300 text-sm font-medium">Network Live</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg"></div>
                                <div className="relative px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-blue-500/30 rounded-xl">
                                    <span className="text-blue-300 text-sm font-medium">50+ Validators</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 flex-1 min-h-screen">
                {/* Hero Section with integrated title */}
                <section className="flex flex-col items-center justify-center py-12 px-6">
                    {/* Floating title badge */}
                    <div className="relative mb-12">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-600/20 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative inline-flex items-center px-8 py-4 rounded-full bg-slate-800/80 border border-blue-500/30 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                                <span className="text-blue-300 text-lg font-semibold flex items-center gap-2">
                                    <MonitoringIcon />
                                    Validator Network Portal
                                </span>
                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                            </div>
                        </div>
                    </div>

                    {/* Main hero content */}
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent leading-tight">
                            Join the Future
                        </h1>
                        <h2 className="text-3xl lg:text-4xl font-semibold mb-8 text-slate-200">
                            of <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Decentralized Monitoring</span>
                        </h2>
                        <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Connect your Phantom wallet to become part of the world's first blockchain-powered website monitoring network. 
                            <span className="text-blue-400 font-semibold"> Earn rewards while securing the web.</span>
                        </p>
                    </div>
                    <div className="relative max-w-2xl w-full">
                        {/* Main connection card with enhanced glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-600/20 rounded-3xl blur-xl animate-pulse"></div>
                        
                        <div className="relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-600/40 rounded-3xl shadow-2xl p-12 w-full">
                            <div className="flex flex-col items-center text-center">
                                {/* Enhanced wallet icon with animations */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
                                    <div className="relative p-6 bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-3xl border border-slate-600/30 shadow-lg">
                                        <Wallet className="w-20 h-20 text-blue-400" />
                                        {walletAddress && (
                                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                                    {walletAddress ? 'Welcome, Validator!' : 'Become a Validator'}
                                </h2>
                                
                                <p className="text-slate-300 mb-10 text-xl leading-relaxed max-w-lg">
                                    {walletAddress 
                                        ? 'Your Phantom wallet is connected. You\'re ready to start validating and earning rewards on the DecentraPing network.'
                                        : 'Connect your Phantom wallet to join our decentralized network of validators and start earning rewards for honest monitoring.'
                                    }
                                </p>

                                {!walletAddress ? (
                                    <div className="w-full space-y-6">
                                        <Button
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-6 rounded-2xl font-semibold flex items-center justify-center gap-4 text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-blue-500/20"
                                            onClick={handleConnectWallet}
                                            disabled={isConnecting}
                                        >
                                            {isConnecting ? (
                                                <>
                                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Connecting to Phantom...
                                                </>
                                            ) : (
                                                <>
                                                    <Wallet className="w-7 h-7" />
                                                    Connect Phantom Wallet
                                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                                </>
                                            )}
                                        </Button>
                                        
                                        {!phantom && (
                                            <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl backdrop-blur-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                                                        <span className="text-amber-400">⚠️</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-amber-400 font-semibold">Phantom Wallet Required</p>
                                                        <p className="text-amber-300/80 text-sm mt-1">Please install the Phantom browser extension to continue.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-6 w-full">
                                        {/* Connected wallet display */}
                                        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-700/80 to-slate-800/80 border border-slate-600/30 rounded-2xl w-full backdrop-blur-sm">
                                            <div className="flex-1 text-left">
                                                <div className="text-sm text-slate-400 mb-2 font-medium">Connected Validator Address</div>
                                                <div className="font-mono text-green-400 text-lg font-semibold">
                                                    {formatAddress(walletAddress)}
                                                </div>
                                            </div>
                                            <button
                                                onClick={copyAddress}
                                                className="p-3 hover:bg-slate-600/50 rounded-xl transition-all duration-200 hover:scale-110"
                                                title="Copy full address"
                                            >
                                                {copied ? (
                                                    <Check className="w-6 h-6 text-green-400" />
                                                ) : (
                                                    <Copy className="w-6 h-6 text-slate-400" />
                                                )}
                                            </button>
                                        </div>
                                        
                                        {/* Validator stats */}
                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl text-center">
                                                <div className="text-2xl font-bold text-green-400">Active</div>
                                                <div className="text-sm text-green-300/80">Status</div>
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl text-center">
                                                <div className="text-2xl font-bold text-blue-400">0.00</div>
                                                <div className="text-sm text-blue-300/80">SOL Earned</div>
                                            </div>
                                        </div>
                                        
                                        <Button
                                            className="w-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 px-6 py-4 rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50"
                                            onClick={handleDisconnect}
                                        >
                                            Disconnect Wallet
                                        </Button>

                                        {/* Success message */}
                                        <div className="p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl w-full backdrop-blur-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                                    <Check className="w-5 h-5 text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-green-400 font-semibold">Successfully Connected!</p>
                                                    <p className="text-green-300/80 text-sm mt-1">You're now part of the DecentraPing validator network.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Validator Benefits Section */}
                <section className="py-20 px-6 bg-slate-800/30 backdrop-blur-sm">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                                Validator Benefits
                            </h3>
                            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                                Join our network and earn rewards while securing the future of decentralized monitoring
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                                    <Award className="w-6 h-6 text-blue-400" />
                                </div>
                                <h4 className="text-lg font-semibold mb-2 text-blue-400">Earn Rewards</h4>
                                <p className="text-slate-300 text-sm">Get paid in SOL tokens for honest validation work</p>
                            </div>
                            
                            <div className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
                                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                                    <Shield className="w-6 h-6 text-green-400" />
                                </div>
                                <h4 className="text-lg font-semibold mb-2 text-green-400">Network Security</h4>
                                <p className="text-slate-300 text-sm">Help secure the decentralized monitoring network</p>
                            </div>
                            
                            <div className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                                    <Zap className="w-6 h-6 text-blue-300" />
                                </div>
                                <h4 className="text-lg font-semibold mb-2 text-blue-300">Low Latency</h4>
                                <p className="text-slate-300 text-sm">Fast validation with minimal resource requirements</p>
                            </div>
                            
                            <div className="group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
                                <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-400/30 transition-colors">
                                    <Globe className="w-6 h-6 text-blue-400" />
                                </div>
                                <h4 className="text-lg font-semibold mb-2 text-blue-400">Global Impact</h4>
                                <p className="text-slate-300 text-sm">Be part of the decentralized web infrastructure</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Network Stats */}
                <section className="py-16 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-3xl p-8 lg:p-12 border border-slate-600/30 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                                Network Statistics
                            </h3>
                            <div className="grid md:grid-cols-4 gap-8 text-center">
                                <div>
                                    <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">50+</div>
                                    <div className="text-slate-300">Active Validators</div>
                                </div>
                                <div>
                                    <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2">1,000+</div>
                                    <div className="text-slate-300">Sites Monitored</div>
                                </div>
                                <div>
                                    <div className="text-3xl lg:text-4xl font-bold text-blue-300 mb-2">99.9%</div>
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
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-8 px-6 bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                                DecentraPing
                            </span>
                            <span className="text-slate-400 ml-2">Validator Portal</span>
                        </div>
                        <div className="text-slate-400 text-sm">
                            © {new Date().getFullYear()} DecentraPing. Built at Hacksagon. Powered by Solana.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}