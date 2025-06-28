'use client';

import { useState } from 'react';

interface MonitorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; url: string }) => void;
}

export default function MonitorModal({ isOpen, onClose, onSubmit }: MonitorModalProps) {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!url.trim()) {
            setError('URL cannot be empty');
            return;
        }

        let finalUrl = url.trim();
        if (!/^https?:\/\//i.test(finalUrl)) {
            finalUrl = 'https://' + finalUrl;
        }

        const finalName = name.trim() || 'Untitled';

        onSubmit({ name: finalName, url: finalUrl });
        setName('');
        setUrl('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-slate-900 text-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4">Monitor this site</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name"
                            className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300">URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="example.com"
                            className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
