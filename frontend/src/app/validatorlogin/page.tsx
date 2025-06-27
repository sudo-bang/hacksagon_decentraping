"use client"

import React, { useState, useEffect } from 'react';
import { Wallet, Copy, Check } from 'lucide-react';
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
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <main className="flex-1 min-h-screen">
            {/* Header */}
            <header className="px-8 py-8 border-b border-slate-700/30 bg-slate-900/95 backdrop-blur-sm shadow-xl">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">
                Validator Portal
                </h1>
                <p className="text-slate-400 max-w-3xl text-lg leading-relaxed mt-4">
                Connect your Phantom wallet to access the DecentraPing validator network.
                </p>
            </div>
            </header>

            {/* Connection Section */}
            <section className="flex flex-col items-center justify-center py-20 px-4">
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-xl"></div>
                
                <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-600/40 rounded-3xl shadow-2xl p-12 w-full max-w-lg">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                    <div className="p-4 bg-slate-700/60 rounded-2xl border border-slate-600/30">
                        <Wallet className="w-16 h-16 text-blue-400" />
                    </div>
                    {walletAddress && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                        </div>
                    )}
                    </div>

                    <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {walletAddress ? 'Wallet Connected' : 'Connect Your Wallet'}
                    </h2>
                    
                    <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                    {walletAddress 
                        ? 'Your Phantom wallet is successfully connected to the DecentraPing network.'
                        : 'Connect your Phantom wallet to begin validating on the DecentraPing network.'
                    }
                    </p>

                    {!walletAddress ? (
                    <div className="w-full">
                        <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-blue-500/20"
                        onClick={handleConnectWallet}
                        disabled={isConnecting}
                        >
                        {isConnecting ? (
                            <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Connecting...
                            </>
                        ) : (
                            <>
                            <Wallet className="w-6 h-6" />
                            Connect Phantom Wallet
                            </>
                        )}
                        </Button>
                        
                        {!phantom && (
                        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                            <p className="text-amber-400 text-sm">
                            ⚠️ Phantom wallet extension not detected. Please install Phantom browser extension first.
                            </p>
                        </div>
                        )}
                    </div>
                    ) : (
                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="flex items-center gap-3 p-4 bg-slate-700/60 border border-slate-600/30 rounded-xl w-full">
                        <div className="flex-1 text-left">
                            <div className="text-sm text-slate-400 mb-1">Connected Address</div>
                            <div className="font-mono text-green-400 text-lg">
                            {formatAddress(walletAddress)}
                            </div>
                        </div>
                        <button
                            onClick={copyAddress}
                            className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                            title="Copy full address"
                        >
                            {copied ? (
                            <Check className="w-5 h-5 text-green-400" />
                            ) : (
                            <Copy className="w-5 h-5 text-slate-400" />
                            )}
                        </button>
                        </div>
                        
                        <Button
                        className="w-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 px-4 py-3 rounded-xl transition-all duration-200 border border-slate-600/30"
                        onClick={handleDisconnect}
                        >
                        Disconnect Wallet
                        </Button>

                        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl w-full">
                        <p className="text-green-400 text-sm text-center">
                            ✅ Successfully connected to DecentraPing network
                        </p>
                        </div>
                    </div>
                    )}
                </div>
                </div>
            </div>
            </section>
        </main>
        </div>
    );
}