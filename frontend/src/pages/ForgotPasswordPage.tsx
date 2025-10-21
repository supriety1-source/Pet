import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('Valid email required'),
});

type FormValues = z.infer<typeof schema>;

const ForgotPasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await api.post('/auth/forgot-password', values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Reset password</h2>
        <p className="mt-2 text-gray-400">We’ll email you recovery instructions if your account exists.</p>
      </div>
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Sending…' : 'Send Reset Link'}
      </Button>
      {isSubmitSuccessful && <p className="text-sm text-green-300">Check your inbox for reset instructions.</p>}
      <Link to="/login" className="block text-sm text-purple-300">
        Back to login
      </Link>
    </form>
  );
};

const ForgotPasswordPage: React.FC = () => (
  <AuthLayout>
    <ForgotPasswordForm />
  </AuthLayout>
);

export default ForgotPasswordPage;
