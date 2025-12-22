import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(formData);
      console.log('Login response:', res);
      console.log('Response data:', res?.data);

      if (res && res.data && res.data.token) {
        const user = res.data.user;
        console.log('User object:', user);
        console.log('User role:', user?.role);

        if (user && user.role === 'admin') {
          console.log('User is admin, redirecting to /admin');
          window.location.href = '/admin';
        } else {
          console.log('User is not admin, redirecting to /');
          window.location.href = '/';
        }
      } else {
        setError('Login failed: Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.msg || err.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white">
      <div className="bg-white/5 p-8 rounded-lg shadow-xl shadow-black/20 backdrop-blur w-full max-w-md border border-white/5">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>

        <form onSubmit={onSubmit}>
          {error && (
            <p className="text-red-400 text-center mb-4">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-slate-300 text-sm font-bold mb-2"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className="shadow appearance-none border border-white/10 rounded w-full py-2 px-3 bg-slate-900/60 text-white leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-slate-300 text-sm font-bold mb-2"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              className="shadow appearance-none border border-white/10 rounded w-full py-2 px-3 bg-slate-900/60 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-brand-orange hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
