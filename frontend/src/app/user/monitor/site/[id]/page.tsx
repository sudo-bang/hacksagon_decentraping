"use client";

import React, { useState, useEffect } from 'react';
import MonitorDetailClient from './MonitorDetailClient';
import { SiteWithAllData } from '../../constant';


// --- SERVER COMPONENT / PAGE ---
// This component simulates the data fetching that would happen on a server.
export default function MonitorDetailPage({ params }: { params: { id: string } }) {
    const [siteData, setSiteData] = useState<SiteWithAllData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    useEffect(() => {
        const fetchSiteData = async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'; // Fallback for environment

                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('token not found');
                    handleLogout();
                    return;
                }

                const res = await fetch(`${backendUrl}/api/sites/sitesdata/${params.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                });

                if (res.status === 401) {
                    console.log('returned 401');
                    handleLogout();
                    return;
                }

                if (!res.ok) {
                    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
                }

                const data: SiteWithAllData = await res.json();
                setSiteData(data);
            } catch (err: any) {
                console.error("Error fetching site data:", err);
                setError(err.message || "Could not load monitoring data for this site.");
            } finally {
                setLoading(false);
            }
        };

        fetchSiteData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="ml-4">Loading Site Data...</p>
            </div>
        );
    }

    if (error || !siteData) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500">Error</h1>
                    <p className="text-slate-400">{error}</p>
                    <p className="text-slate-500 text-sm">The site might not exist or you may not have permission to view it.</p>
                </div>
            </div>
        );
    }

    return <MonitorDetailClient initialMonitorData={siteData} />;
}
