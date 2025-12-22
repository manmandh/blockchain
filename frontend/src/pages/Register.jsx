import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        '/api/auth/register',
        formData
      );

      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white">
      <div className="bg-white/5 p-8 rounded-lg shadow-xl shadow-black/20 backdrop-blur w-full max-w-md border border-white/5">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Register
        </h2>

        <form onSubmit={onSubmit}>
          {error && (
            <p className="text-red-400 text-center mb-4">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-slate-300 text-sm font-bold mb-2"
            >
              Username
            </label>

            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              className="shadow appearance-none border border-white/10 rounded w-full py-2 px-3 bg-slate-900/60 text-white leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

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
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
