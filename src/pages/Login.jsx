// src/pages/Login.jsx
import React, { useState } from 'react';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setBusy(true);
        setError('');
        const res = await onLogin(username.trim(), password);
        setBusy(false);
        if (!res?.ok) setError(res?.error || 'Login failed');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
                <h1 className="text-2xl font-bold mb-1 text-center">Garage Management System</h1>
                <p className="text-center text-gray-500 mb-6">Sign in to continue</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Username</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            placeholder="admin"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border rounded px-3 py-2"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full bg-gray-900 text-white rounded py-2 hover:bg-gray-800 disabled:opacity-60"
                    >
                        {busy ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p className="text-xs text-gray-500 mt-6 text-center">
                    Demo login: <b>admin</b> / <b>admin123</b>
                </p>
            </div>
        </div>
    );
}
