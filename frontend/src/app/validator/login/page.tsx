"use client";

import React, { useState, useEffect, useMemo, FC } from 'react';
import { Wallet, Copy, Check, Shield, Zap, Globe, Award, Loader2, Download, KeyRound, CheckCircle, User, Activity, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Solana Wallet Adapter imports
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection, PublicKey, SystemProgram, Keypair, Transaction, VersionedTransaction } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { saveAs } from 'file-saver';
import axios from 'axios';

import idl from './solana_program.json'; 

require('@solana/wallet-adapter-react-ui/styles.css');

// --- Main App Component ---
// This now includes basic routing to switch between the login and sites pages.
export default function App() {
    const network = "https://api.devnet.solana.com";
    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
    ], []);

    return (
        <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <AppRouter />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

// --- Simple Router Component ---
function AppRouter() {
    const [page, setPage] = useState('login');

    if (page === 'sites') {
        return <ValidatorSitesDashboard />;
    }
    return <ValidatorPortal onRegisterSuccess={() => setPage('sites')} />;
}


// --- Validator Sites Dashboard Component ---
type StatusType = "online" | "offline" | "warning" | "pending";
interface Website {
  _id: string;
  url: string;
  name: string;
  lastStatus: StatusType;
  lastChecked: string | null;
}

function ValidatorSitesDashboard() {
    const [sites, setSites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // In a real app, you'd fetch from your deployed backend URL
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`);
                // The backend /api/jobs returns { siteId, url }. We need to fetch full details.
                // For the hackathon, we'll use the jobs endpoint and supplement with mock data.
                // A production app would have a dedicated endpoint for this dashboard.
                const jobs = response.data.map((job: any) => ({
                    _id: job.siteId,
                    url: job.url,
                    name: new URL(job.url).hostname.replace('www.', ''),
                    lastStatus: 'pending' as StatusType,
                    lastChecked: null,
                }));

                setSites(jobs);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                // Fallback to mock data on error
                setSites([
                    { _id: '1', url: 'https://google.com', name: 'Google', lastStatus: 'online', lastChecked: new Date().toISOString() }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
        const interval = setInterval(fetchJobs, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const StatusIndicator = ({ status }: { status: StatusType }) => {
        const statusConfig = {
            online: 'bg-emerald-500 shadow-emerald-500/50',
            offline: 'bg-red-500 shadow-red-500/50',
            warning: 'bg-amber-500 shadow-amber-500/50',
            pending: 'bg-gray-500 shadow-gray-500/50',
        };
        return <div className={`w-3 h-3 rounded-full ${statusConfig[status]} shadow-lg animate-pulse`} />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex relative overflow-hidden">
             <aside className="fixed left-0 top-0 h-full w-20 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col items-center py-6 z-50 shadow-2xl">
                {/* Sidebar content from your original UI */}
             </aside>
             <main className="ml-20 flex-1 min-h-screen relative z-10">
                <header className="px-8 py-8 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Active Monitoring Jobs
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">
                        The following sites are actively being monitored by the network.
                    </p>
                </header>
                <section className="p-8">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                         </div>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                            {sites.map((site) => (
                                <div key={site._id} className="group bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-6 hover:border-cyan-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transform hover:-translate-y-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-cyan-500/30">
                                                    <Globe className="w-7 h-7 text-cyan-400" />
                                                </div>
                                                <div className="absolute -top-1 -right-1">
                                                    <StatusIndicator status={site.lastStatus} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-xl">{site.name}</h3>
                                                <p className="text-slate-400 text-sm">{site.url}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
             </main>
        </div>
    );
}


// --- Validator Portal Component ---
function ValidatorPortal({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
    const { publicKey: identityKey, signTransaction, signAllTransactions } = useWallet();
    const { connection } = useConnection();
    
    const program = useMemo(() => {
        if (!connection || !identityKey || !signTransaction || !signAllTransactions) return null;
        if (!idl?.address) {
             console.error("IDL file is missing its 'address' field.");
             return null;
        }
        const providerWallet = {
            publicKey: identityKey,
            signTransaction: (tx: Transaction | VersionedTransaction) => signTransaction(tx as any),
            signAllTransactions: (txs: (Transaction | VersionedTransaction)[]) => signAllTransactions(txs as any[]),
        };
        const provider = new AnchorProvider(connection, providerWallet, { commitment: 'confirmed' });
        // @ts-ignore
        return new Program(idl, provider);
    }, [connection, identityKey, signTransaction, signAllTransactions]);
    
    const [operationalKeypair, setOperationalKeypair] = useState<Keypair | null>(null);
    const [isKeyDownloaded, setIsKeyDownloaded] = useState(false);
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
    const [reputation, setReputation] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [copied, setCopied] = useState('');

    const checkRegistration = async () => {
        if (!identityKey || !program) return;
        setIsLoading(true);
        try {
            const [validatorAccountPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("validator"), identityKey.toBuffer()],
                program.programId
            );
            const accountInfo = await program.account.validatorAccount.fetch(validatorAccountPDA);
            setIsRegistered(true);
            setReputation(accountInfo.reputation.toNumber());
        } catch (error) {
            setIsRegistered(false);
            setReputation(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (identityKey && program) {
            checkRegistration();
        } else {
            setIsRegistered(null);
        }
    }, [identityKey, program]);

    const handleGenerateKeys = () => {
        const newKeypair = Keypair.generate();
        setOperationalKeypair(newKeypair);
        setIsKeyDownloaded(false);
    };

    const handleDownloadKeyFile = () => {
        if (!operationalKeypair) return;
        const secretKey = `[${operationalKeypair.secretKey.toString()}]`;
        const blob = new Blob([secretKey], { type: "application/json;charset=utf-8" });
        saveAs(blob, "validator-keypair.json");
        setIsKeyDownloaded(true);
    };

    const handleRegister = async () => {
        if (!program || !identityKey || !operationalKeypair) {
            alert("Wallet not connected, program not initialized, or operational key not generated.");
            return;
        }
        setIsRegistering(true);
        try {
            const [validatorAccountPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("validator"), identityKey.toBuffer()],
                program.programId
            );
            const txSignature = await program.methods
                .registerValidator(operationalKeypair.publicKey)
                .accounts({
                    validatorAccount: validatorAccountPDA,
                    identityAuthority: identityKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
            console.log("Registration successful! Tx:", txSignature);
            alert("Registration successful! You will now be redirected.");
            await checkRegistration();
            onRegisterSuccess(); // Trigger redirection
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. See console for details.");
        } finally {
            setIsRegistering(false);
        }
    };

    const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-6)}`;

    const renderRegistrationSteps = () => (
        <div className="w-full space-y-4 text-left">
            <h3 className="text-2xl font-bold text-center text-slate-100 mb-6">Become a Validator</h3>
            <div className={`p-4 bg-slate-800/50 border rounded-2xl w-full transition-all ${operationalKeypair ? 'border-green-500/30' : 'border-slate-600/30'}`}>
                <div className="flex items-center gap-4">
                    {operationalKeypair ? <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" /> : <KeyRound className="w-8 h-8 text-blue-400 flex-shrink-0" />}
                    <div className="flex-1">
                        <div className="font-semibold text-slate-200">Step 1: Generate Operational Key</div>
                    </div>
                    <Button variant="secondary" onClick={handleGenerateKeys}>{operationalKeypair ? 'Re-generate' : 'Generate'}</Button>
                </div>
            </div>
            <div className={`p-4 bg-slate-800/50 border rounded-2xl w-full transition-all ${!operationalKeypair && 'opacity-50'}`}>
                <div className="flex items-center gap-4">
                    {isKeyDownloaded ? <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" /> : <Download className="w-8 h-8 text-blue-400 flex-shrink-0" />}
                    <div className="flex-1">
                        <div className="font-semibold text-slate-200">Step 2: Download Your Files</div>
                    </div>
                </div>
                 <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button className="w-full" variant="secondary" onClick={handleDownloadKeyFile} disabled={!operationalKeypair}>
                        Download Key File
                    </Button>
                    <a href="/validator-kit.zip" download>
                        <Button className="w-full" variant="secondary" disabled={!operationalKeypair}>
                            Download Kit
                        </Button>
                    </a>
                </div>
            </div>
            <div className={`p-4 bg-slate-800/50 border rounded-2xl w-full transition-all ${!isKeyDownloaded && 'opacity-50'}`}>
                <div className="flex items-center gap-4">
                    <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                        <div className="font-semibold text-slate-200">Step 3: Register On-Chain</div>
                    </div>
                </div>
                <Button className="w-full mt-4" onClick={handleRegister} disabled={!isKeyDownloaded || isRegistering}>
                    {isRegistering && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isRegistering ? 'Registering...' : 'Register Validator'}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            <header className="relative z-10 px-6 pt-8">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
                        <div className="relative px-6 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-600/40 rounded-2xl">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">DecentraPing</span>
                            <span className="text-slate-400 ml-2 text-sm">Validator</span>
                        </div>
                    </div>
                    <WalletMultiButton style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(71, 85, 105, 0.4)', backdropFilter: 'blur(4px)' }} />
                </div>
            </header>

            <main className="relative z-10 flex flex-col items-center justify-center py-12 px-6">
                <div className="relative max-w-2xl w-full bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-600/40 rounded-3xl shadow-2xl p-8 sm:p-12">
                    <div className="absolute -inset-px bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-blue-600/30 rounded-3xl blur-xl animate-pulse"></div>
                    <div className="relative flex flex-col items-center text-center">
                        {!identityKey ? (
                            <div className="flex flex-col items-center text-center">
                                <div className="relative p-6 bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-3xl border border-slate-600/30 shadow-lg mb-8">
                                    <Wallet className="w-20 h-20 text-blue-400" />
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-slate-200">Validator Portal</h2>
                                <p className="text-slate-300 mb-8 text-lg">Connect your Identity Wallet to begin.</p>
                                <WalletMultiButton className="!w-full !bg-gradient-to-r !from-blue-600 !to-blue-700 !hover:from-blue-700 !hover:to-blue-800 !text-white !px-10 !py-6 !rounded-2xl !font-semibold !flex !items-center !justify-center !gap-4 !text-xl !shadow-2xl" />
                            </div>
                        ) : (
                            isLoading ? (
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                    <span className="text-lg">Checking registration status...</span>
                                </div>
                            ) : isRegistered ? (
                                // If already registered, show a welcome message and a button to view sites
                                <div className="w-full text-center p-6 bg-green-900/50 border border-green-500/30 rounded-2xl">
                                    <h3 className="text-2xl font-bold text-green-300">Welcome Back, Validator!</h3>
                                    <p className="text-green-400/80 mt-2">You are already registered.</p>
                                    <Button className="w-full mt-6" onClick={onRegisterSuccess}>
                                        Go to Sites Dashboard
                                    </Button>
                                </div>
                            ) : renderRegistrationSteps()
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}