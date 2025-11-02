import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { actsAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Upload, X, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export const LogActPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'offline',
    act_date: format(new Date(), 'yyyy-MM-dd'),
    location: '',
  });

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Category options
  const categoryOptions = [
    { value: 'offline', label: 'Offline Kindness' },
    { value: 'online', label: 'Online Kindness' },
    { value: 'community', label: 'Community Support' },
  ];

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi'];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, media: 'Please upload an image (JPG, PNG, GIF) or video (MP4, MOV, AVI)' });
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setErrors({ ...errors, media: 'File size must be less than 10MB' });
      return;
    }

    setMediaFile(file);
    setErrors({ ...errors, media: '' });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded file
  const removeFile = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.act_date) {
      newErrors.act_date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.act_date);
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);

      if (selectedDate > today) {
        newErrors.act_date = 'Date cannot be in the future';
      } else if (selectedDate < sevenDaysAgo) {
        newErrors.act_date = 'Date cannot be more than 7 days ago';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('category', formData.category);
      submitData.append('act_date', formData.act_date);

      if (formData.location.trim()) {
        submitData.append('location', formData.location.trim());
      }

      if (mediaFile) {
        submitData.append('media', mediaFile);
      }

      await actsAPI.create(submitData);

      // Refresh user stats
      await refreshUser();

      // Show success message
      setSubmitSuccess(true);

      // Reset form after a delay
      setTimeout(() => {
        navigate('/my-acts');
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting act:', error);
      const errorMsg = error.response?.data?.errors?.[0]?.msg ||
                      error.response?.data?.error ||
                      'Failed to submit act. Please try again.';
      setErrors({ submit: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-accent-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-dark mb-2">
            Act Submitted!
          </h2>
          <p className="text-gray-medium mb-4">
            Your act of kindness is under review. You just trained AI to be kinder. Thank you.
          </p>
          <p className="text-sm text-gray-medium italic">
            Redirecting to your acts...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-dark mb-2">
            Log Your Act of Kindness
          </h1>
          <p className="text-gray-medium">
            Share what you did to make the world better. AI is watching, and learning from you.
          </p>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="What did you do?"
              name="title"
              placeholder="e.g., Helped neighbor carry groceries"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              maxLength={255}
              required
            />

            {/* Description */}
            <Textarea
              label="Tell us more"
              name="description"
              placeholder="Describe your act of kindness in detail. What happened? How did it make you feel? What impact did it have?"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              rows={5}
              helperText="Minimum 20 characters"
              required
            />

            {/* Category and Date - Two columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categoryOptions}
                error={errors.category}
                required
              />

              <Input
                label="Date"
                name="act_date"
                type="date"
                value={formData.act_date}
                onChange={handleChange}
                error={errors.act_date}
                helperText="Max 7 days ago"
                max={format(new Date(), 'yyyy-MM-dd')}
                min={format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}
                required
              />
            </div>

            {/* Location (optional) */}
            <Input
              label="Location (optional)"
              name="location"
              placeholder="Where did this happen?"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
            />

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Upload Proof (optional but encouraged)
              </label>

              {!mediaPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-medium mb-2">
                    Upload a photo or video of your act
                  </p>
                  <label className="inline-block">
                    <span className="btn-secondary cursor-pointer inline-block">
                      Choose File
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-medium mt-2">
                    Images or videos up to 10MB
                  </p>
                </div>
              ) : (
                <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                  {mediaFile?.type.startsWith('image/') ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full max-h-64 object-cover"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      controls
                      className="w-full max-h-64"
                    />
                  )}
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {errors.media && (
                <p className="mt-1 text-sm text-red-500">{errors.media}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                Submit for Verification
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-gray-dark mb-2">
            💡 Tips for verification
          </h3>
          <ul className="space-y-1 text-sm text-gray-medium">
            <li>• Be specific and detailed in your description</li>
            <li>• Photos/videos increase verification chances</li>
            <li>• Acts are typically reviewed within 24 hours</li>
            <li>• Verified acts earn 1 Kindness Credit</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
