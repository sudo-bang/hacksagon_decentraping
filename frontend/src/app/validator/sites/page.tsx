"use client"

import React, { useState, useEffect } from 'react';
import { Globe, User, Download, Search, Zap, Shield, Activity, Eye } from 'lucide-react';

type StatusType = "online" | "offline" | "warning";

interface StatusIndicatorProps {
  status: StatusType;
}

// Define the type for a single website object
interface Website {
  id: number;
  url: string;
  name: string;
  status: StatusType; // Ensure this matches StatusType
  responseTime: string;
  validators: number;
  uptime: number;
}

// Mock data for available websites to validate
const availableWebsites: Website[] = [ // Explicitly type the array
  {
    id: 1,
    url: 'https://google.com',
    name: 'Google',
    status: 'online',
    responseTime: '12ms',
    validators: 1247,
    uptime: 99.9
  },
  {
    id: 2,
    url: 'https://github.com',
    name: 'GitHub',
    status: 'online',
    responseTime: '45ms',
    validators: 892,
    uptime: 99.7
  },
  {
    id: 3,
    url: 'https://stackoverflow.com',
    name: 'Stack Overflow',
    status: 'warning',
    responseTime: '156ms',
    validators: 634,
    uptime: 98.2
  },
  {
    id: 4,
    url: 'https://reddit.com',
    name: 'Reddit',
    status: 'online',
    responseTime: '78ms',
    validators: 1056,
    uptime: 99.4
  },
  {
    id: 5,
    url: 'https://twitter.com',
    name: 'Twitter',
    status: 'offline',
    responseTime: 'N/A',
    validators: 423,
    uptime: 95.1
  },
  {
    id: 6,
    url: 'https://linkedin.com',
    name: 'LinkedIn',
    status: 'online',
    responseTime: '89ms',
    validators: 745,
    uptime: 99.1
  },
  {
    id: 7,
    url: 'https://netflix.com',
    name: 'Netflix',
    status: 'online',
    responseTime: '23ms',
    validators: 1834,
    uptime: 99.8
  },
  {
    id: 8,
    url: 'https://spotify.com',
    name: 'Spotify',
    status: 'online',
    responseTime: '67ms',
    validators: 956,
    uptime: 99.3
  },
];

const DecentraPingLogo = () => (
  <svg width="28" height="28" viewBox="0 0 100 100" className="text-emerald-400">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    
    {/* Monitor/Screen */}
    <rect x="15" y="20" width="70" height="45" rx="4" fill="none" stroke="url(#gradient)" strokeWidth="3"/>
    <rect x="18" y="23" width="64" height="39" rx="2" fill="url(#gradient)" fillOpacity="0.1"/>
    
    {/* Monitor Stand */}
    <rect x="42" y="65" width="16" height="8" rx="2" fill="url(#gradient)"/>
    <rect x="35" y="73" width="30" height="4" rx="2" fill="url(#gradient)"/>
    
    {/* Chart/Graph Lines */}
    <polyline points="25,45 35,35 45,40 55,25 65,30 75,20" 
              fill="none" stroke="url(#gradient)" strokeWidth="2.5" strokeLinecap="round"/>
    
    {/* Data Point */}
    <circle cx="55" cy="25" r="3" fill="url(#gradient)"/>
    
    {/* Side Panel Lines */}
    <line x1="65" y1="30" x2="75" y2="30" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="65" y1="35" x2="75" y2="35" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="65" y1="40" x2="72" y2="40" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round"/>
    
    {/* Connection/Network Lines */}
    <path d="M25 50 Q15 45 20 35" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeOpacity="0.6"/>
    <path d="M75 50 Q85 45 80 35" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeOpacity="0.6"/>
  </svg>
);

const navItems = [
  {
    label: 'DecentraPing',
    icon: <DecentraPingLogo />,
    href: '/',
  },
  {
    label: 'Download Script',
    icon: <Download className="w-5 h-5" />,
    href: '/',
  },
];

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'warning': return 'bg-amber-500 shadow-amber-500/50';
      case 'offline': return 'bg-red-500 shadow-red-500/50';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`w-3 h-3 rounded-full ${getStatusColor()} shadow-lg animate-pulse`} />
  );
};

const FloatingParticles = () => {
  const particles = [
    { left: '10%', top: '20%', delay: '0s', duration: '3s' },
    { left: '80%', top: '10%', delay: '1s', duration: '4s' },
    { left: '60%', top: '70%', delay: '2s', duration: '5s' },
    { left: '30%', top: '50%', delay: '0.5s', duration: '3.5s' },
    { left: '90%', top: '80%', delay: '1.5s', duration: '4.5s' },
    { left: '20%', top: '90%', delay: '2.5s', duration: '6s' },
    { left: '70%', top: '30%', delay: '0.8s', duration: '3.8s' },
    { left: '40%', top: '15%', delay: '1.8s', duration: '4.2s' },
    { left: '85%', top: '60%', delay: '0.3s', duration: '5.5s' },
    { left: '15%', top: '75%', delay: '2.2s', duration: '3.2s' }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-bounce"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration
          }}
        />
      ))}
    </div>
  );
};

export default function ValidatorSites() {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  // FIX: Type selectedSite to be a Website object or null
  const [selectedSite, setSelectedSite] = useState<Website | null>(null); 

  const filteredWebsites = availableWebsites.filter((website) => {
    return website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           website.url.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalValidators = availableWebsites.reduce((sum, site) => sum + site.validators, 0);
  const averageUptime = (availableWebsites.reduce((sum, site) => sum + site.uptime, 0) / availableWebsites.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex relative overflow-hidden">
      <FloatingParticles />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)] animate-pulse" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Enhanced Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col items-center py-6 z-50 shadow-2xl">
        <nav className="flex flex-col space-y-6">
          {navItems.map((item) => (
            <div key={item.label} className="group relative">
              <button className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 w-full flex items-center justify-center focus:outline-none border border-transparent hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transform hover:scale-110">
                {item.icon}
                <span className="absolute left-20 top-1/2 -translate-y-1/2 bg-slate-800/95 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-cyan-500/30">
                  {item.label}
                </span>
              </button>
            </div>
          ))}
        </nav>
        
        <div className="mt-auto relative">
          <button
            className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 border border-transparent hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transform hover:scale-110"
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="Profile menu"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-xs font-semibold border border-slate-500/50">
              <User className="w-4 h-4" />
            </div>
          </button>
          {profileOpen && (
            <div className="absolute left-20 bottom-0 mb-2 bg-slate-800/95 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl py-3 w-44 z-50 animate-fade-in-up">
              <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-200 rounded-lg mx-2">
                View Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200 rounded-lg mx-2">
                Log Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-20 flex-1 min-h-screen relative z-10">
        {/* Enhanced Header */}
        <header className="px-8 py-8 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                <Globe className="w-10 h-10 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Validator Network
                </h1>
                <p className="text-slate-400 mt-2 max-w-2xl text-lg">
                  Monitor and validate websites across the decentralized network
                </p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="flex space-x-6">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-4 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-500/30 group">
                <div className="text-3xl font-bold text-emerald-400 group-hover:scale-110 transition-transform duration-300">{availableWebsites.length}</div>
                <div className="text-slate-400 text-sm">Active Sites</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-4 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-500/30 group">
                <div className="text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">{totalValidators.toLocaleString()}</div>
                <div className="text-slate-400 text-sm">Validators</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-4 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-500/30 group">
                <div className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform duration-300">{averageUptime}%</div>
                <div className="text-slate-400 text-sm">Avg Uptime</div>
              </div>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
              placeholder="Search the validator network..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:shadow-lg focus:shadow-cyan-500/10 transition-all duration-300"
            />
          </div>
        </header>

        {/* Enhanced Websites Grid */}
        <section className="p-8">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredWebsites.map((website) => (
              <div
                key={website.id}
                className="group bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-6 hover:border-cyan-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedSite(website)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300 group-hover:scale-110">
                        <Globe className="w-7 h-7 text-cyan-400" />
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <StatusIndicator status={website.status} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl group-hover:text-cyan-300 transition-colors duration-300">{website.name}</h3>
                      <p className="text-slate-400 text-sm">{website.url}</p>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-slate-700/50 rounded-xl border border-slate-600/30">
                    <div className="flex items-center justify-center mb-1">
                      <Zap className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold text-yellow-400">{website.responseTime}</span>
                    </div>
                    <div className="text-xs text-slate-400">Response</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/50 rounded-xl border border-slate-600/30">
                    <div className="flex items-center justify-center mb-1">
                      <Shield className="w-4 h-4 text-emerald-400 mr-1" />
                      <span className="text-sm font-semibold text-emerald-400">{website.validators}</span>
                    </div>
                    <div className="text-xs text-slate-400">Validators</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/50 rounded-xl border border-slate-600/30">
                    <div className="flex items-center justify-center mb-1">
                      <Activity className="w-4 h-4 text-purple-400 mr-1" />
                      <span className="text-sm font-semibold text-purple-400">{website.uptime}%</span>
                    </div>
                    <div className="text-xs text-slate-400">Uptime</div>
                  </div>
                </div>

                {/* Hover Action */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button className="w-full py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 font-medium hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredWebsites.length === 0 && (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <Globe className="w-20 h-20 text-slate-600 mx-auto mb-6 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl" />
              </div>
              <h3 className="text-2xl font-bold text-slate-400 mb-3">No validators found</h3>
              <p className="text-slate-500 text-lg">Try adjusting your search parameters</p>
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}