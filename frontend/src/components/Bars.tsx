import React from 'react';

// Test data generator - use when no data is provided
const generateTestData = (totalBars = 30, uptimePercent = 95) => {
    const downBars = Math.floor((100 - uptimePercent) / 100 * totalBars);
    return Array.from({ length: totalBars }, (_, i) => i >= downBars);
};

function getBarColor(status: (boolean | null)) {
    if (status === null) return 'bg-gray-500';
    return status ? 'bg-green-500' : 'bg-red-500';
}

const UptimeBars = ({ uptimeData }: { uptimeData?: (boolean|null)[] }) => {
    // Use provided data or generate test data
    const barsData = uptimeData || generateTestData(30, 95);

    // Calculate uptime percentage from the boolean array
    const upBars = barsData.filter(Boolean).length;
    const uptimePercent = ((upBars / barsData.length) * 100).toFixed(1);

    return (
        <div className="uptime-bars">
            <div className="flex gap-1 mb-2">
                {barsData.map((isUp, i) => (
                    <div
                        key={i}
                        className={`w-2 h-8 rounded-sm ${getBarColor(isUp)}`}
                    />
                ))}
            </div>
            <div className="text-sm text-gray-200">
                Uptime: {uptimePercent}%
            </div>
        </div>
    );
};

export default UptimeBars;