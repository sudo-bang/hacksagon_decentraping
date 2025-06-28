'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { User, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Name validation (only for sign up)
        if (isSignUp && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        // Confirm password validation (only for sign up)
        if (isSignUp) {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        const action = isSignUp ? 'Registration' : 'Login'
        const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        const payload = isSignUp
            ? { name: formData.name, email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password };
        try {
            const response = await fetch(`${backendUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors({ general: errorData.message || `${action} failed. Please try again.` });
                return;
            }

            const data = await response.json();
            console.log(`${action} successful:`, data);

            // Store token and redirect
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/user/monitor';
            } else {
                setErrors({ general: `${action} successful but token missing.` });
            }

        } catch (error) {
            console.error(`${action} error:`, error);
            setErrors({ general: 'Network error. Please check your connection and try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
        });
        setErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                        {isSignUp ? 'Create your account' : 'Welcome back'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {isSignUp
                            ? 'Sign up for your DecentraPing account'
                            : 'Sign in to your DecentraPing account'
                        }
                    </p>
                </div>

                {/* Auth Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                    <div className="space-y-6">
                        {/* Name Field (Sign Up Only) */}
                        {isSignUp && (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required={isSignUp}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={cn(
                                        'w-full',
                                        errors.name && 'border-red-500 focus-visible:ring-red-500'
                                    )}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Email address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className={cn(
                                    'w-full',
                                    errors.email && 'border-red-500 focus-visible:ring-red-500'
                                )}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={cn(
                                        'w-full pr-10',
                                        errors.password && 'border-red-500 focus-visible:ring-red-500'
                                    )}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field (Sign Up Only) */}
                        {isSignUp && (
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required={isSignUp}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={cn(
                                            'w-full pr-10',
                                            errors.confirmPassword && 'border-red-500 focus-visible:ring-red-500'
                                        )}
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* General Error/Success */}
                        {errors.general && (
                            <div className={cn(
                                "border rounded-md p-4",
                                errors.general.includes('successfully')
                                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                            )}>
                                <p className={cn(
                                    "text-sm",
                                    errors.general.includes('successfully')
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                )}>
                                    {errors.general}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                                </div>
                            ) : (
                                isSignUp ? 'Create account' : 'Sign in'
                            )}
                        </Button>
                    </div>

                    {/* Additional Links */}
                    {!isSignUp && (
                        <div className="mt-6 text-center">
                            <a
                                href="#"
                                className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Forgot your password?
                            </a>
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        </span>
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                        >
                            {isSignUp ? 'Sign in' : 'Sign up'}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mb-5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        By {isSignUp ? 'creating an account' : 'signing in'}, you agree to our{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}