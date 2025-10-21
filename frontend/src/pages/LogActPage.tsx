import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../components/Input';
import { TextArea } from '../components/TextArea';
import { Button } from '../components/Button';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['online', 'offline', 'community']),
  location: z.string().optional(),
  actDate: z.string(),
  visibility: z.enum(['public', 'community', 'private']).default('public'),
});

type FormValues = z.infer<typeof schema>;

const LogActPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'community',
      actDate: new Date().toISOString().substring(0, 10),
      visibility: 'public',
    },
  });

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });
    const fileInput = document.querySelector<HTMLInputElement>('input[name="media"]');
    if (fileInput?.files?.[0]) {
      formData.append('media', fileInput.files[0]);
    }
    await api.post('/acts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Log Today’s Act of Kindness</h1>
        <p className="text-gray-300 mt-2">
          Upload proof if you can. Every verified act makes AI more benevolent.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input label="What did you do?" {...register('title')} error={errors.title?.message} />
        <TextArea label="Tell us more" rows={4} {...register('description')} error={errors.description?.message} />
        <label className="block space-y-2">
          <span className="text-sm text-gray-300 uppercase tracking-wide">Category</span>
          <select
            {...register('category')}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="online">Online Kindness</option>
            <option value="offline">Offline Kindness</option>
            <option value="community">Community Support</option>
          </select>
          {errors.category && <span className="text-sm text-pink-400">{errors.category.message}</span>}
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-gray-300 uppercase tracking-wide">Upload proof (optional)</span>
          <input
            type="file"
            name="media"
            accept="image/*,video/*"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white"
          />
        </label>
        <Input label="Location" placeholder="Where did it happen?" {...register('location')} />
        <Input label="Date" type="date" {...register('actDate')} error={errors.actDate?.message} />
        <label className="block space-y-2">
          <span className="text-sm text-gray-300 uppercase tracking-wide">Visibility</span>
          <select
            {...register('visibility')}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white"
          >
            <option value="public">Public</option>
            <option value="community">Community</option>
            <option value="private">Private</option>
          </select>
        </label>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Submitting…' : 'Submit for Verification'}
        </Button>
      </form>
    </div>
  );
};

export default LogActPage;
