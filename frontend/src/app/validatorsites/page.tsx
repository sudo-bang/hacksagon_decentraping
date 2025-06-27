"use client"

import React, { useState } from 'react';
import { Globe, User, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for available websites to validate
const availableWebsites = [
  {
    id: 1,
    url: 'https://google.com',
    name: 'Google',
  },
  {
    id: 2,
    url: 'https://github.com',
    name: 'GitHub',
  },
  {
    id: 3,
    url: 'https://stackoverflow.com',
    name: 'Stack Overflow',
  },
  {
    id: 4,
    url: 'https://reddit.com',
    name: 'Reddit',
  },
  {
    id: 5,
    url: 'https://twitter.com',
    name: 'Twitter',
  },
  {
    id: 6,
    url: 'https://linkedin.com',
    name: 'LinkedIn',
  },
  {
    id: 7,
    url: 'https://netflix.com',
    name: 'Netflix',
  },
  {
    id: 8,
    url: 'https://spotify.com',
    name: 'Spotify',
  },
];
const navItems = [
    {
        label: 'DecentraPing',
        icon: <Image src="/logo.png" alt="DecentraPing Logo" width={30} height={30} className="rounded-full" />,
        href: '/',
    },
    {
        label: 'Download Script',
        icon: <Download className="w-5 h-5" />,
        href: '/',
    },
];

export default function ValidatorSites() {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const filteredWebsites = availableWebsites.filter((website) => {
    return website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           website.url.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Custom Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-16 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-4 z-50">
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="group relative">
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors w-full flex items-center justify-center focus:outline-none">
              {item.icon}
              <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-medium px-3 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all pointer-events-none whitespace-nowrap z-50 border border-slate-700">
                {item.label}
              </span>
            </button>
          </Link>
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

      {/* Main Content */}
      <main className="ml-16 flex-1 min-h-screen">
        <header className="px-8 py-8 border-b border-slate-700 bg-slate-900/90 backdrop-blur-xs shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                <Globe className="w-8 h-8" />
                Available Sites for Validation
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl">
                Browse websites available for validation in the DecentraPing network.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{availableWebsites.length}</div>
              <div className="text-slate-400 text-sm">Total Sites</div>
            </div>
          </div>

          {/* Search Control */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search websites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>
        </header>

        {/* Websites List */}
        <section className="p-8">
          <div className="space-y-3">
            {filteredWebsites.map((website) => (
              <div
                key={website.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{website.name}</h3>
                      <p className="text-slate-400 text-sm">{website.url}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredWebsites.length === 0 && (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No websites found</h3>
              <p className="text-slate-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
