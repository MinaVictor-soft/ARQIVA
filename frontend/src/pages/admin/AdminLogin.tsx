import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => api.post('/auth/login', data),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data.data;
      setUser(user);
      setTokens(accessToken, refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/admin/dashboard');
    },
    onError: () => setError('Invalid email or password'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate({ email, password });
  };

  return (
    <div className="admin-root admin-light min-h-screen flex items-center justify-center px-4" data-force-light>
      <div className="w-full max-w-sm bg-white/70 border border-stone-brown/20 p-10 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-[#2A1A12] tracking-widest uppercase mb-2">ARQIVA</h1>
          <p className="text-stone-brown/60 text-xs tracking-[0.3em] uppercase">Admin Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest uppercase text-stone-brown/60 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-stone-brown/25 px-4 py-3 text-[#2A1A12] text-sm focus:border-stone-brown/50 focus:outline-none transition-colors"
              placeholder="admin@arqivastudio.com"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-stone-brown/60 block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-stone-brown/25 px-4 py-3 text-[#2A1A12] text-sm focus:border-stone-brown/50 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[#2A1A12] text-[#F5F0E8] py-3 text-sm tracking-widest uppercase font-medium hover:bg-stone-brown transition-colors disabled:opacity-50 mt-2"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
