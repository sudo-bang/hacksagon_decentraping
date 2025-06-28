import { Monitor, Shield, Bell, BarChart3, Settings, User } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
    {
        label: 'DecentraPing',
        icon: <Image src="/logo.png" alt="DecentraPing Logo" width={30} height={30} className="rounded-full" />,
        href: '/',
    },
    {
        label: 'Monitors',
        icon: <Monitor className="w-5 h-5" />,
        href: '/user/monitor',
    },
    {
        label: 'Security',
        icon: <Shield className="w-5 h-5" />,
    },
    {
        label: 'Alerts',
        icon: <Bell className="w-5 h-5" />,
    },
    {
        label: 'Analytics',
        icon: <BarChart3 className="w-5 h-5" />,
    },
    {
        label: 'Settings',
        icon: <Settings className="w-5 h-5" />,
    },
];

export default function App() {
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <aside className="fixed left-0 top-0 h-full w-16 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-4 z-50">
            <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                    // Using a standard <a> tag instead of Next.js Link
                    <a key={item.label} href={item.href}>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors w-full flex items-center justify-center focus:outline-none">
                            {item.icon}
                            {/* The span remains invisible as per your previous request */}
                            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-medium px-3 py-1 rounded-md shadow-lg opacity-0 whitespace-nowrap z-50 border border-slate-700">
                                {item.label}
                            </span>
                        </button>
                    </a>
                ))}
            </nav>
            <div className="mt-auto relative">
                <button
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-label="Profile menu"
                >
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        <User className="w-5 h-5" />
                    </div>
                </button>
                {profileOpen && (
                    <div className="absolute left-16 bottom-0 mb-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg py-2 w-40 z-50 animate-fade-in-up">
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors"
                            onClick={() => { setProfileOpen(false); /* TODO: navigate to profile */ }}
                        >
                            View Profile
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                            onClick={() => { setProfileOpen(false); /* TODO: log out logic */ }}
                        >
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
