// app/monitor/[id]/page.tsx (This is now a Server Component)

// NO "use client" directive here!
import MonitorDetailClient from './MonitorDetailClient'; // Import your new Client Component

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

export async function generateStaticParams() {
  // This function runs at build time on the server
  // Return the IDs for the monitors that should be pre-generated
  // This matches the mock data from the main page
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
}

// This component is a Server Component by default because it doesn't have "use client"
export default async function MonitorDetailPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch data based on params.id here.
  // This data fetching happens on the server, potentially at build time (SSG) or request time (SSR).
  const monitor: MonitorDetails = {
    id: params.id,
    name: 'google.com',
    url: 'https://google.com',
    status: 'up',
    uptime: 100,
    responseTime: 88,
    lastChecked: 'Coming soon',
    incidents: 0,
    protocol: 'HTTPS',
    uptimeStatus: 'Currently up for 0h 14m 29s',
    uptimeDuration: 'Checked every 5 minutes',
    checkFrequency: '5 minutes',
    certificateValid: true,
    sslExpiry: 'Certificate valid until',
    region: 'North America',
    plan: 'Solo Team'
  };

  return (
    // Render the Client Component, passing the server-fetched data as props
    <MonitorDetailClient initialMonitorData={monitor} />
  );
}