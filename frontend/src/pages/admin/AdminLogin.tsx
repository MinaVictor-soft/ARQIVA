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
    <div className="admin-root min-h-screen bg-primary-black flex items-center justify-center px-4 [color-scheme:dark]" data-force-dark>
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl text-warm-white tracking-widest uppercase mb-2">ARQIVA</h1>
          <p className="text-warm-white/30 text-xs tracking-[0.3em] uppercase">Admin Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest uppercase text-warm-white/40 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-warm-white/15 px-4 py-3 text-warm-white text-sm focus:border-warm-white/40 focus:outline-none transition-colors"
              placeholder="admin@arqivastudio.com"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-warm-white/40 block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border border-warm-white/15 px-4 py-3 text-warm-white text-sm focus:border-warm-white/40 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-warm-white text-primary-black py-3 text-sm tracking-widest uppercase font-medium hover:bg-arch-beige transition-colors disabled:opacity-50 mt-2"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-6 text-warm-white/20 text-xs">
          Default: admin@arqivastudio.com / Admin@123456
        </p>
      </div>
    </div>
  );
}
