'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyToken(token);
    }
  }, [searchParams]);

  async function verifyToken(token: string) {
    setStatus('verifying');
    try {
      const res = await fetch('/api/v1/users/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('Email verified successfully! You can now sign in.');
      } else {
        setStatus('error');
        setMessage(json.error?.message || 'Verification failed');
      }
    } catch {
      setStatus('error');
      setMessage('An unexpected error occurred');
    }
  }

  async function resendVerification() {
    if (!email) return;
    try {
      await fetch('/api/v1/users/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setMessage('Verification email resent. Check your inbox.');
    } catch {
      setMessage('Failed to resend verification email');
    }
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
        <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </div>

      <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Check your email</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        We sent a verification link to <span className="font-medium">{email || 'your email'}</span>.
        Click the link to verify your account.
      </p>

      {status === 'verifying' && (
        <p className="mt-4 text-sm text-blue-600 dark:text-blue-400">Verifying your email...</p>
      )}
      {status === 'success' && (
        <p className="mt-4 text-sm text-green-600 dark:text-green-400">{message}</p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{message}</p>
      )}

      <div className="mt-6 space-y-3">
        {email && (
          <button
            onClick={resendVerification}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Resend verification email
          </button>
        )}
        <Link
          href="/login"
          className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
