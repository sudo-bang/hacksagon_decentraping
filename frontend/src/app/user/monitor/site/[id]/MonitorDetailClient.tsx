// app/monitor/[id]/MonitorDetailClient.tsx
"use client";

import React, { useState, useEffect } from 'react';
// Removed 'next/navigation' import to resolve build error. Will use window.history for navigation.
import { format, parseISO, formatDistanceToNowStrict } from 'date-fns';
import { ArrowLeft, Bell, ExternalLink, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming these are available globally or defined elsewhere
import { Badge } from '@/components/ui/badge';
import { SiteWithAllData } from '../../constant';


// --- PLACEHOLDER COMPONENTS (To resolve import errors) ---

/**
 * Placeholder for the UptimeBars component.
 * Renders a series of bars indicating uptime status.
 */
const UptimeBars = ({ uptimeData }: { uptimeData: (boolean | null)[] }) => {
    return (
        <div className="flex items-center space-x-1 h-8">
            {uptimeData.map((status, index) => {
                let barColor = 'bg-slate-700'; // Default for null/pending
                if (status === true) {
                    barColor = 'bg-green-500';
                } else if (status === false) {
                    barColor = 'bg-red-500';
                }
                return (
                    <div key={index} className="w-full h-full rounded-sm" style={{ backgroundColor: barColor.split('-')[0] }}>
                        <div className={`w-full h-full rounded-sm ${barColor}`} title={`Check ${index + 1}: ${status === null ? 'No Data' : status ? 'Up' : 'Down'}`}></div>
                    </div>
                );
            })}
        </div>
    );
};


/**
 * Placeholder for the Sidebar component.
 */
const Sidebar = ({ handleLogout }: { handleLogout: () => void }) => {
    // A minimal sidebar structure.
    return (
        <aside className="fixed left-0 top-0 h-full w-16 md:w-64 bg-slate-800 border-r border-slate-700 z-50 flex flex-col justify-between p-4">
            <div>
                <div className="text-white font-bold text-lg hidden md:block">Dashboard</div>
                <div className="text-white font-bold text-lg md:hidden">D</div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                Logout
            </Button>
        </aside>
    );
};


// --- MAIN COMPONENT ---

interface MonitorDetailClientProps {
    initialMonitorData: SiteWithAllData;
}

export default function MonitorDetailClient({ initialMonitorData }: MonitorDetailClientProps) {
    const [isMounted, setIsMounted] = useState(false);
    // const router = useRouter(); // Removed due to build error
    const monitor = initialMonitorData;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // --- Data Processing and Helper Functions ---
    const { monitoringData } = monitor;
    const incidents = monitoringData.results.filter(r => !r.result.uptime);
    const validLoadTimes = monitoringData.loadTime.filter((t): t is number => t !== null);
    const minLoadTime = validLoadTimes.length > 0 ? Math.min(...validLoadTimes) : 0;
    const maxLoadTime = validLoadTimes.length > 0 ? Math.max(...validLoadTimes) : 0;
    const lastSslValid = monitoringData.sslValid[monitoringData.sslValid.length - 1];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'up': return 'bg-green-500';
            case 'down': return 'bg-red-500';
            default: return 'bg-gray-500'; // PENDING
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'up': return 'Up';
            case 'down': return 'Down';
            default: return 'Pending';
        }
    };

    const handleLogout = () => {
        // A simple logout implementation
        console.log("Logging out...");
        window.location.href = '/'; // Redirect to login/home
    };

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-slate-900 text-white">
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <Sidebar handleLogout={handleLogout} />

            {/* Main Content */}
            <main className="ml-16 md:ml-64 p-4 md:p-8">
                {/* Header */}
                <header className="pb-6 border-b border-slate-700">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            onClick={() => window.history.back()} // Changed to window.history.back()
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-slate-400">Monitoring</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(monitor.lastStatus)}`}></div>
                            <div>
                                <h1 className="text-2xl font-semibold text-white">{monitor.name}</h1>
                                <div className="flex items-center space-x-2 text-sm text-slate-400">
                                    <span>Monitor for</span>
                                    <a href={monitor.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center space-x-1">
                                        <span>{monitor.url}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                            <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                                <Bell className="w-4 h-4 mr-2" />
                                Test Notification
                            </Button>
                            <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700">
                                {monitor.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                {monitor.isActive ? 'Pause' : 'Resume'}
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Status Cards */}
                <div className="py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Current Status */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <h3 className="text-sm text-slate-400 mb-2">Current status</h3>
                            <div className={`text-2xl font-bold ${monitor.lastStatus === 'UP' ? 'text-green-400' : 'text-red-400'} mb-1`}>
                                {getStatusText(monitor.lastStatus)}
                            </div>
                            <div className="text-sm text-slate-400">
                                {monitor.lastChecked ? `For ${formatDistanceToNowStrict(parseISO(monitor.lastChecked))}` : 'Not checked yet'}
                            </div>
                        </div>

                        {/* Last Check */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <h3 className="text-sm text-slate-400 mb-2">Last check</h3>
                            <div className="text-2xl font-bold text-white mb-1">
                                {monitor.lastChecked ? formatDistanceToNowStrict(parseISO(monitor.lastChecked), { addSuffix: true }) : 'N/A'}
                            </div>
                            <div className="text-sm text-slate-400">
                                {monitor.lastChecked ? format(parseISO(monitor.lastChecked), 'MMM d, yyyy HH:mm') : '-'}
                            </div>
                        </div>

                        {/* Recent Uptime */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <h3 className="text-sm text-slate-400 mb-2">Recent Uptime (Last 10 Checks)</h3>
                            <div className="text-2xl font-bold text-white mb-1">{monitoringData.averageUptime}%</div>
                            <div className="w-full overflow-hidden my-2">
                                <UptimeBars uptimeData={monitoringData.uptime} />
                            </div>
                            <div className="text-sm text-slate-400">{incidents.length} incidents</div>
                        </div>

                        {/* Domain & SSL */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <h3 className="text-sm text-slate-400 mb-2">SSL Certificate</h3>
                            <div className="flex items-center space-x-2 mb-2">
                                {lastSslValid === null ? (
                                    <Minus className="w-4 h-4 text-slate-400" />
                                ) : lastSslValid ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                )}
                                <span className="text-lg font-bold text-white">
                                    {lastSslValid === null ? 'No Data' : lastSslValid ? 'Valid' : 'Invalid'}
                                </span>
                            </div>
                            <div className="text-xs text-slate-500">Checked with last scan</div>
                        </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-white mb-6">Response time (Last 10 Checks)</h3>
                        <div className="h-32 bg-slate-900 rounded-lg mb-6 relative flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-sm text-slate-400">Average</div>
                                <div className="text-4xl font-bold text-white mb-1">{monitoringData.averageLoadTime}<span className="text-2xl text-slate-400">ms</span></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <TrendingDown className="w-4 h-4 text-green-400" />
                                    <span className="text-2xl font-bold text-white">{minLoadTime} ms</span>
                                </div>
                                <div className="text-sm text-slate-400">Minimum</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <Minus className="w-4 h-4 text-slate-400" />
                                    <span className="text-2xl font-bold text-white">{monitoringData.averageLoadTime} ms</span>
                                </div>
                                <div className="text-sm text-slate-400">Average</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-red-400" />
                                    <span className="text-2xl font-bold text-white">{maxLoadTime} ms</span>
                                </div>
                                <div className="text-sm text-slate-400">Maximum</div>
                            </div>
                        </div>
                    </div>

                    {/* Latest Incidents */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-6">Latest Incidents</h3>
                        {incidents.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                </div>
                                <h4 className="text-xl font-semibold text-white mb-2">Good job, no incidents.</h4>
                                <p className="text-slate-400">No downtime recorded in the last 10 checks.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {incidents.map((incident) => (
                                    <div key={incident._id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-red-400">Site was Down</p>
                                                <p className="text-sm text-slate-400">
                                                    Load time: {incident.result.loadTime}ms
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500">
                                            {format(parseISO(incident.timestamp), 'MMM d, yyyy HH:mm')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
