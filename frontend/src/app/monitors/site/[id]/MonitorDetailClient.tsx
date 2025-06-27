// app/monitor/[id]/MonitorDetailClient.tsx
"use client"; // This directive is CRUCIAL for this component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Bell, Shield, BarChart3, Monitor, ExternalLink, Clock, Globe, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MonitorDetails {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'paused';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  incidents: number;
  protocol: string;
  uptimeStatus: string;
  uptimeDuration: string;
  checkFrequency: string;
  certificateValid: boolean;
  sslExpiry: string;
  region: string;
  plan: string;
}

interface MonitorDetailClientProps {
  initialMonitorData: MonitorDetails; // Pass initial data from server
}

export default function MonitorDetailClient({ initialMonitorData }: MonitorDetailClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // We'll use the initial data passed from the server.
  // If you need to re-fetch or modify data on the client, you'd add more state/effects here.
  const monitor = initialMonitorData;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'bg-green-500';
      case 'down': return 'bg-red-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'up': return 'Up';
      case 'down': return 'Down';
      case 'paused': return 'Paused';
      default: return 'Unknown';
    }
  };

  // The loading spinner will only show if the client component itself hasn't mounted yet
  // but the server has already rendered the outer shell.
  // For production, you might consider a skeleton UI instead of `null` or a full spinner here.
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
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 flex flex-col z-50">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="font-semibold text-white">UptimeRobot</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg bg-slate-700 text-green-400"
            >
              <Monitor className="w-4 h-4" />
              <span className="text-sm">Monitoring</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Incidents</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Status pages</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Maintenance</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Team members</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Integrations & API</span>
            </button>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-semibold">
              EE
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Efve Erf</div>
            </div>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            Upgrade now
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mr-80">
        {/* Header */}
        <header className="px-8 py-6 border-b border-slate-700">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-slate-400">Monitoring</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(monitor.status)}`}></div>
              <div>
                <h1 className="text-2xl font-semibold text-white">{monitor.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <span>{monitor.protocol} monitor for</span>
                  <a href={monitor.url} className="text-blue-400 hover:text-blue-300 flex items-center space-x-1">
                    <span>{monitor.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white">
                <Bell className="w-4 h-4 mr-2" />
                Test Notification
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white">
                Pause
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white">
                Edit
              </Button>
            </div>
          </div>
        </header>

        {/* Status Cards */}
        <div className="p-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Current Status */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm text-slate-400 mb-2">Current status</h3>
              <div className="text-2xl font-bold text-green-400 mb-1">{getStatusText(monitor.status)}</div>
              <div className="text-sm text-slate-400">{monitor.uptimeStatus}</div>
            </div>

            {/* Last Check */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm text-slate-400 mb-2">Last check</h3>
              <div className="text-2xl font-bold text-white mb-1">{monitor.lastChecked}</div>
              <div className="text-sm text-slate-400">{monitor.uptimeDuration}</div>
            </div>

            {/* Last 24 Hours */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm text-slate-400 mb-2">Last 24 hours</h3>
              <div className="text-2xl font-bold text-white mb-1">{monitor.uptime}%</div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${monitor.uptime}%` }}></div>
                </div>
              </div>
              <div className="text-sm text-slate-400 mt-2">0 incidents, 0m down</div>
            </div>

            {/* Domain & SSL */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm text-slate-400 mb-2">Domain & SSL</h3>
              <div className="text-2xl font-bold text-white mb-1">{monitor.uptime}%</div>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-400">Unlock</span>
              </div>
              <div className="text-xs text-slate-500">{monitor.sslExpiry}</div>
            </div>
          </div>

          {/* Uptime Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm text-slate-400 mb-2">Last 7 days</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-sm text-slate-400">0 incidents, 0m down</div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm text-slate-400 mb-2">Last 30 days</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-sm text-slate-400">0 incidents, 0m down</div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm text-slate-400 mb-2">Last 365 days</h3>
              <div className="text-3xl font-bold text-white mb-2">--.--%</div>
              <div className="text-sm text-blue-400 cursor-pointer">Unlock with paid plans</div>
              <div className="text-sm text-slate-400">-- incidents, -- down</div>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Response time</h3>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Within limits
                </Badge>
                <span className="text-sm text-slate-400">For slow response times</span>
                <span className="text-sm text-slate-400">Last hour</span>
              </div>
            </div>

            {/* Response Time Chart Area */}
            <div className="h-32 bg-slate-900 rounded-lg mb-6 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">88 ms</div>
                  <div className="text-sm text-slate-400">Jan 27, 08 17:42AM GMT+1:30</div>
                </div>
              </div>
            </div>

            {/* Response Time Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Minus className="w-4 h-4 text-slate-400" />
                  <span className="text-2xl font-bold text-white">88 ms</span>
                </div>
                <div className="text-sm text-slate-400">Average</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-green-400" />
                  <span className="text-2xl font-bold text-white">88 ms</span>
                </div>
                <div className="text-sm text-slate-400">Minimum</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <span className="text-2xl font-bold text-white">88 ms</span>
                </div>
                <div className="text-sm text-slate-400">Maximum</div>
              </div>
            </div>
          </div>

          {/* Latest Incidents */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Latest incidents</h3>

            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">👍 Good job, no incidents.</h4>
              <p className="text-slate-400">No incidents so far. Keep it up!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Right Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-80 bg-slate-800 border-l border-slate-700 p-6 overflow-y-auto z-50">
        <div className="space-y-6">
          {/* Next Maintenance */}
          <div>
            <h3 className="text-lg font-semibold text-white">Next maintenance</h3>
            <div className="text-center py-8">
              <div className="text-slate-400">No maintenance planned.</div>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white">
                Set up maintenance
              </Button>
            </div>
          </div>

          {/* Regions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Regions</h3>
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <div className="w-full h-32 bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
                <Globe className="w-12 h-12 text-slate-500" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-white">{monitor.region}</div>
              </div>
            </div>
          </div>

          {/* To be notified */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">To be notified</h3>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-semibold">
                EE
              </div>
            </div>
          </div>

          {/* Appears on */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Appears on</h3>
            <div className="text-slate-400 text-sm">No status pages configured</div>
          </div>
        </div>
      </aside>
    </div>
  );
}