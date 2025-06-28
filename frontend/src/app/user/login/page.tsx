'use client';

import React, { useState } from 'react';
import { SignInCard2 } from '@/components/ui/sign-in-card-2';
import { SignUpCard2 } from '@/components/ui/sign-up-card-2';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
    };

    // If it's sign-in mode, use the SignInCard2 component
    if (!isSignUp) {
        return (
            <div className="relative">
                <SignInCard2 />
                {/* Toggle to sign up - positioned absolutely over the component */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="text-center">
                        <span className="text-sm text-white/60">
                            Don't have an account?{' '}
                        </span>
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-sm text-white hover:text-white/80 font-medium underline"
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Sign up mode - use the SignUpCard2 component
    return (
        <div className="relative">
            <SignUpCard2 />
            {/* Toggle to sign in - positioned absolutely over the component */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="text-center">
                    <span className="text-sm text-white/60">
                        Already have an account?{' '}
                    </span>
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-sm text-white hover:text-white/80 font-medium underline"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}