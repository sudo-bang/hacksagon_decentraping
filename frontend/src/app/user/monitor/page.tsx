'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Monitor, Settings, Bell, Shield, BarChart3, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from '@/components/sidebar';
import NewMonitorModal from '@/components/NewMonitorModal';
import { formatDistanceToNow } from 'date-fns'; // Optional: install this for better time display
import UptimeBars from '@/components/Bars';
import { SiteWithMonitoringData } from './constant';

function getStatusColor(status: string) {
    switch (status) {
        case 'UP':
            return 'bg-green-500';
        case 'DOWN':
            return 'bg-red-500';
        case 'PENDING':
        default:
            return 'bg-yellow-500';
    }
}

export default function MonitoringDashboard() {
    const [monitors, setMonitors] = useState<SiteWithMonitoringData[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedTags, setSelectedTags] = useState('All tags');
    const [sortOrder, setSortOrder] = useState('Down first');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const summary = useMemo(() => {
        let upCount = 0;
        let downCount = 0;
        let pauseCount = 0;
        monitors.forEach((monitor) => {
            if (monitor.isActive) {
                if (monitor.lastStatus.toLowerCase() === 'up') {
                    upCount++;
                } else if (monitor.lastStatus.toLowerCase() === 'down') {
                    downCount++;
                } else {
                    pauseCount++;
                }
            }
            else {
                pauseCount++;
            }
        });
        return {
            upCount,
            downCount,
            pauseCount
        };
    }, [monitors]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleMonitorClick = (monitor: SiteWithMonitoringData) => {
        router.push(`/user/monitor/site/${monitor._id}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const fetchMonitors = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('token not found');
            handleLogout();
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sites/sitesdata`, {
                headers: {
                    'x-auth-token': token,
                },
            });

            if (response.status === 401) {
                console.log('returned 401');
                handleLogout();
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching monitors:', errorData.msg || response.statusText);
                return;
            }

            const data = await response.json();
            setMonitors(data);

        } catch (error) {
            console.error('Error fetching monitors:', error);
        }
    };

    const handleAdd = async (data: { name: string; url: string }) => {
        console.log('Submitted:', data);

        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sites/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(data),
            });

            if (response.status === 401) {
                handleLogout();
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.msg || 'Failed to add site');
                return;
            }

            const result = await response.json();
            console.log('Site added:', result);
            fetchMonitors();

        } catch (error) {
            console.error('Error adding site:', error);
            alert('Something went wrong. Please try again later.');
        }
    };

    // Updated useEffect to poll every 5 seconds
    useEffect(() => {
        // Call immediately on mount
        fetchMonitors();

        // Set up interval to call every 5 seconds
        const interval = setInterval(() => {
            fetchMonitors();
        }, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

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
            {/* Fixed Left Sidebar */}
            <Sidebar handleLogout={handleLogout} />

            {/* Main Content */}
            <main className="ml-16 mr-80">
                {/* Header */}
                <header className="px-8 py-6 border-b border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-semibold">Monitors</h1>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>New monitor</span>
                            </Button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-slate-400">
                                <span className="text-white">0</span> / <span className="text-white">1</span>
                            </div>
                            <button className="text-sm text-slate-400 hover:text-white transition-colors">
                                Bulk actions
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Select value={selectedTags} onValueChange={setSelectedTags}>
                                <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white hover:bg-slate-750 hover:border-slate-600">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="All tags" className="text-white hover:bg-slate-750">All tags</SelectItem>
                                    <SelectItem value="Production" className="text-white hover:bg-slate-750">Production</SelectItem>
                                    <SelectItem value="Staging" className="text-white hover:bg-slate-750">Staging</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search by name or url"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-64 bg-slate-800 border-slate-700 text-white placeholder-slate-400 hover:border-slate-600 focus:border-slate-500"
                                />
                            </div>

                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-white hover:bg-slate-750 hover:border-slate-600">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="Down first" className="text-white hover:bg-slate-750">Down first</SelectItem>
                                    <SelectItem value="Up first" className="text-white hover:bg-slate-750">Up first</SelectItem>
                                    <SelectItem value="Name A-Z" className="text-white hover:bg-slate-750">Name A-Z</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750 hover:border-slate-600 hover:text-white">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Monitor Cards */}
                <div className="p-8 space-y-4">
                    {monitors.map((monitor: SiteWithMonitoringData) => (

                        <button
                            key={monitor._id}
                            onClick={() => handleMonitorClick(monitor)}
                            className="w-full p-6 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-all duration-200 hover:border-slate-600 text-left group cursor-pointer"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    {/* Status indicator considers if the monitor is active */}
                                    <div className={`w-3 h-3 rounded-full ${!monitor.isActive ? 'bg-gray-500' : getStatusColor(monitor.lastStatus)}`}></div>
                                    <div>
                                        <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                            {monitor.name}
                                        </h3>
                                        <p className="text-sm text-slate-400">{monitor.url}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-8 w-full sm:w-auto justify-between mt-4 sm:mt-0">
                                    <div className="text-right">
                                        {/* Display Last Status and Last Checked Time */}
                                        <div className="text-sm font-medium text-white capitalize">
                                            {monitor.isActive ? monitor.lastStatus.toLowerCase() : 'Paused'}
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            {monitor.lastChecked
                                                ? `${formatDistanceToNow(new Date(monitor.lastChecked), { addSuffix: true })}`
                                                : 'Never'}
                                        </div>
                                    </div>

                                    {/* Uptime and Performance Metrics */}
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            {/* Display Average Load Time */}
                                            <div className="text-sm font-medium text-white">
                                                {monitor.monitoringData.averageLoadTime.toFixed(0)} ms
                                            </div>
                                            <div className="text-sm text-slate-400">Avg. Load</div>
                                        </div>
                                        <div className="text-right block md:hidden">
                                            {/* Display Average Uptime Percentage */}
                                            <div className="text-sm font-medium text-white">
                                                {monitor.monitoringData.averageUptime.toFixed(2)}%
                                            </div>
                                            <div className="text-sm text-slate-400">Uptime</div>
                                        </div>
                                    </div>

                                    {/* Uptime Visualization */}
                                    <div className="hidden md:block">
                                        <UptimeBars uptimeData={monitor.monitoringData.uptime} />
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </main>

            {/* Fixed Right Sidebar */}
            <aside className="fixed right-0 top-0 h-full w-80 bg-slate-800 border-l border-slate-700 p-6 overflow-y-auto z-50">
                <div className="space-y-6">
                    {/* Current Status */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            Current status
                            <button className="ml-auto p-1 text-slate-400 hover:text-white transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </h2>

                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                                <Monitor className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-white">{summary.downCount}</div>
                                <div className="text-sm text-slate-400">Down</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{summary.upCount}</div>
                                <div className="text-sm text-slate-400">Up</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{summary.pauseCount}</div>
                                <div className="text-sm text-slate-400">Paused</div>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm text-slate-400">
                            Using {monitors.length} of 50 monitors
                        </div>
                    </div>

                    {/* Last 24 Hours */}
                    {/* <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            Last 24 hours
                            <button className="ml-auto p-1 text-slate-400 hover:text-white transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-red-500">0.929%</div>
                                    <div className="text-sm text-slate-400">Overall uptime</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">0</div>
                                    <div className="text-sm text-slate-400">Incidents</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-white">1d</div>
                                    <div className="text-sm text-slate-400">Without incident</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">0</div>
                                    <div className="text-sm text-slate-400">Affected monitors</div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </aside>

            <NewMonitorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAdd}
            />
        </div>
    );
}