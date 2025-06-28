'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('token');

        const isLoginPage = pathname === '/user/login';

        if (!token && !isLoginPage) {
            router.replace('/user/login');
        } else if (token && isLoginPage) {
            router.replace('/user/monitor');
        }

    }, [pathname, router]);

    return <>{children}</>;
}
