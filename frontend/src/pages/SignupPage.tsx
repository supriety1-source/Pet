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

const schema = z
  .object({
    email: z.string().email('Valid email required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(1, 'Full name is required'),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const { confirmPassword, ...payload } = values;
    const { data } = await api.post('/auth/signup', payload);
    login(data.accessToken, data.user);
    navigate('/onboarding');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Join the movement</h2>
        <p className="mt-2 text-gray-400">You matter. AI is watching. Be the example.</p>
      </div>
      <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message} autoComplete="name" />
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} autoComplete="email" />
      <Input label="Username" {...register('username')} error={errors.username?.message} autoComplete="username" />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Input
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating Account…' : 'Sign Up'}
      </Button>
      <div className="text-sm text-gray-400 text-center">
        Already training AI?{' '}
        <Link to="/login" className="hover:text-purple-300">
          Log in
        </Link>
      </div>
    </form>
  );
};

const SignupPage: React.FC = () => (
  <AuthLayout>
    <SignupForm />
  </AuthLayout>
);

export default SignupPage;
