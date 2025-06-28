"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from './UserDataContext';
import { User as UserIcon, Mail, Phone, Save, X } from 'lucide-react';

interface EditProfileFormProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });
  const [errors, setErrors] = useState<{name?: string; email?: string; phone?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: {name?: string; email?: string; phone?: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number format is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onSave({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
            <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4">
      <div className="flex items-center mb-4">
        <UserIcon className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Edit Profile Information</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
            <UserIcon className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors ${
              errors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center">
              <X className="w-3 h-3 mr-1" />
              {errors.name}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
            <Mail className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors ${
              errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center">
              <X className="w-3 h-3 mr-1" />
              {errors.email}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
            <Phone className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors ${
              errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center">
              <X className="w-3 h-3 mr-1" />
              {errors.phone}
            </p>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3 h-3 mr-1" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm; 