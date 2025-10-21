import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const schema = z.object({
  identifier: z.string().min(3, 'Email or username required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const { data } = await api.post('/auth/login', values);
    login(data.accessToken, data.user);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Welcome back</h2>
        <p className="mt-2 text-gray-400">Your kindness is training AI right now. Let’s keep the streak alive.</p>
      </div>
      <Input label="Email or Username" {...register('identifier')} error={errors.identifier?.message} autoComplete="username" />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Signing In…' : 'Log In'}
      </Button>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <Link to="/forgot-password" className="hover:text-purple-300">
          Forgot password?
        </Link>
        <Link to="/signup" className="hover:text-purple-300">
          Need an account?
        </Link>
      </div>
    </form>
  );
};

const LoginPage: React.FC = () => (
  <AuthLayout>
    <LoginForm />
  </AuthLayout>
);

export default LoginPage;
