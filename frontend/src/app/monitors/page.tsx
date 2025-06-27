'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Monitor, Settings, Bell, Shield, BarChart3, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MonitorData {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'paused';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  incidents: number;
}

export default function MonitoringDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTags, setSelectedTags] = useState('All tags');
  const [sortOrder, setSortOrder] = useState('Down first');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const monitors: MonitorData[] = [
    {
      id: '1',
      name: 'google.com',
      url: 'HTTP • Up 13 min, 24 sec',
      status: 'up',
      uptime: 100,
      responseTime: 5,
      lastChecked: '5 min',
      incidents: 0
    },
    {
      id: '2',
      name: 'api.example.com',
      url: 'HTTPS • Up 2 days, 14 hours',
      status: 'up',
      uptime: 99.9,
      responseTime: 120,
      lastChecked: '2 min',
      incidents: 1
    },
    {
      id: '3',
      name: 'staging.app.com',
      url: 'HTTP • Down 5 min, 32 sec',
      status: 'down',
      uptime: 95.2,
      responseTime: 0,
      lastChecked: '1 min',
      incidents: 3
    }
  ];

  const handleMonitorClick = (monitor: MonitorData) => {
    router.push(`/monitors/site/${monitor.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'bg-green-500';
      case 'down': return 'bg-red-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getUptimeBarColor = (uptime: number) => {
    if (uptime >= 99) return 'bg-green-500';
    if (uptime >= 95) return 'bg-yellow-500';
    return 'bg-red-500';
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
      {/* Fixed Left Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-16 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-4 z-50">
        <div className="w-8 h-8 bg-green-500 rounded-full mb-8 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        
        <nav className="flex flex-col space-y-4">
          <button className="p-2 rounded-lg bg-slate-700 text-green-400">
            <Monitor className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <Shield className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <BarChart3 className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </nav>

        <div className="mt-auto">
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-semibold">
              EE
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-16 mr-80">
        {/* Header */}
        <header className="px-8 py-6 border-b border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold">Monitors</h1>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
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
                <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="All tags">All tags</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Staging">Staging</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name or url"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-36 bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="Down first">Down first</SelectItem>
                  <SelectItem value="Up first">Up first</SelectItem>
                  <SelectItem value="Name A-Z">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </header>

        {/* Monitor Cards */}
        <div className="p-8 space-y-4">
          {monitors.map((monitor) => (
            <button
              key={monitor.id}
              onClick={() => handleMonitorClick(monitor)}
              className="w-full p-6 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-all duration-200 hover:border-slate-600 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(monitor.status)}`}></div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                      {monitor.name}
                    </h3>
                    <p className="text-sm text-slate-400">{monitor.url}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <div className="text-sm text-slate-400">{monitor.lastChecked}</div>
                  </div>

                  <div className="w-48">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Uptime</span>
                      <span className="text-xs font-medium text-white">{monitor.uptime}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${getUptimeBarColor(monitor.uptime)} transition-all duration-300`}
                        style={{ width: `${monitor.uptime}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="p-1 text-slate-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
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
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-slate-400">Down</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-sm text-slate-400">Up</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-slate-400">Paused</div>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-slate-400">
              Using 1 of 50 monitors
            </div>
          </div>

          {/* Last 24 Hours */}
          <div>
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
          </div>
        </div>
      </aside>
    </div>
  );
}