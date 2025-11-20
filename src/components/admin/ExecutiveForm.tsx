'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import ExecutivePreview from './ExecutivePreview';
import type { Executive as PreviewExecutive } from '@/types/executive';

interface AdminExecutive {
  id: string;
  name: string;
  position: string;
  title: string | null;
  is_co_founder: boolean | null;
  bio: string | null;
  image: string | null;
  responsibilities: string[] | null;
  joined_year: number | null;
  email: string | null;
  instagram: string | null;
  introduction: string | null;
  degree: string | null;
  favourite_skills: string[] | null;
}

interface ExecutiveFormProps {
  executive: AdminExecutive | null;
  onClose: () => void;
}

export default function ExecutiveForm({ executive, onClose }: ExecutiveFormProps) {
  const isEditing = !!executive;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(executive?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    id: executive?.id || '',
    name: executive?.name || '',
    position: executive?.position || '',
    title: executive?.title || 'Executive',
    is_co_founder: executive?.is_co_founder ?? false,
    bio: executive?.bio || '',
    image: executive?.image || '',
    responsibilities: executive?.responsibilities?.join('\n') || '',
    joined_year: executive?.joined_year || '',
    email: executive?.email || '',
    instagram: executive?.instagram || '',
    introduction: executive?.introduction || '',
    degree: executive?.degree || '',
    favourite_skills: executive?.favourite_skills?.join(', ') || '',
  });

  const responsibilitiesPreview = useMemo(() =>
    formData.responsibilities
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0),
    [formData.responsibilities]
  );

  const favouriteSkillsPreview = useMemo(() =>
    formData.favourite_skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
    [formData.favourite_skills]
  );

  const joinedYearPreview = useMemo(() => {
    if (typeof formData.joined_year === 'number') return formData.joined_year;
    const parsed = parseInt(String(formData.joined_year), 10);
    return Number.isFinite(parsed) ? parsed : new Date().getFullYear();
  }, [formData.joined_year]);

  const previewExecutive: PreviewExecutive = {
    id: formData.id || 'preview-id',
    name: formData.name || 'Executive Name',
    position: formData.position || 'Role Title',
    title: formData.title || 'Executive',
    isCoFounder: formData.is_co_founder ?? false,
    bio: formData.bio || '',
    image: imagePreview || formData.image || '',
    email: formData.email || 'preview@example.com',
    instagram: formData.instagram || '',
    joinedYear: joinedYearPreview,
    responsibilities: responsibilitiesPreview,
    introduction: formData.introduction || '',
    degree: formData.degree || '',
    favouriteSkills: favouriteSkillsPreview,
  };

  // File validation
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload a JPEG, PNG, or WebP image.';
    }

    if (file.size > maxSize) {
      return 'File size too large. Maximum size is 20MB.';
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setUploadError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file immediately
    await uploadFile(file);
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      // Generate unique filename - use ID if available, otherwise use temp ID
      const fileExt = file.name.split('.').pop();
      const execId = formData.id || `temp-${Date.now()}`;
      const fileName = `${execId}-${Date.now()}.${fileExt}`;
      const filePath = `executives/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('executive-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        // If file already exists, try with different timestamp
        if (error.message.includes('already exists')) {
          const retryFileName = `${execId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const retryPath = `executives/${retryFileName}`;
          const { data: retryData, error: retryError } = await supabase.storage
            .from('executive-photos')
            .upload(retryPath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (retryError) throw retryError;

          const { data: urlData } = supabase.storage
            .from('executive-photos')
            .getPublicUrl(retryPath);

          if (urlData?.publicUrl) {
            setFormData(prev => ({ ...prev, image: urlData.publicUrl }));
          }
          return;
        }
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('executive-photos')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        // Update form data with the new URL
        setFormData(prev => ({
          ...prev,
          image: urlData.publicUrl
        }));

        // If editing and had a previous image, delete old one (optional cleanup)
        if (isEditing && executive?.image && executive.image.includes('executive-photos')) {
          // Extract old file path from URL and delete it
          const urlParts = executive.image.split('executive-photos/');
          if (urlParts.length > 1) {
            const oldPath = urlParts[1].split('?')[0];
            if (oldPath) {
              await supabase.storage
                .from('executive-photos')
                .remove([`executives/${oldPath}`]);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadError(error.message || 'Failed to upload image. Please try again.');
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClearExistingImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validation helper functions
  const ESTIMATED_LONG_WORD_LENGTH = 6; // baseline for bio
  const MAX_NAME_CHARACTERS = 32;

  const estimateWordsFromCharacters = (characters: number) =>
    Math.max(1, Math.floor(characters / ESTIMATED_LONG_WORD_LENGTH));

  const validateName = (value: string): string | null => {
    if (value.length > MAX_NAME_CHARACTERS) {
      const approxWords = Math.max(1, Math.floor(value.length / 6.5)); // ~4-5 words at 32 chars
      return `Name must be ${MAX_NAME_CHARACTERS} characters or less (currently ${value.length}, approx. ${approxWords} words)`;
    }
    return null;
  };

  const validateBio = (value: string): string | null => {
    if (value.length > 50) {
      return `Bio must be 50 characters or less (currently ${value.length}, approx. ${estimateWordsFromCharacters(value.length)} words)`;
    }
    return null;
  };

  const MIN_INTRO_CHARACTERS = 700;
  const MAX_INTRO_CHARACTERS = 750;

  const estimateIntroWords = (characters: number) =>
    Math.max(1, Math.floor(characters / 6.25)); // tuned for ~120 words at 750 chars

  const validateIntroduction = (value: string): string | null => {
    if (value.length < MIN_INTRO_CHARACTERS) {
      return `Introduction must be at least ${MIN_INTRO_CHARACTERS} characters (currently ${value.length}, approx. ${estimateIntroWords(value.length)} words)`;
    }
    if (value.length > MAX_INTRO_CHARACTERS) {
      return `Introduction must be ${MAX_INTRO_CHARACTERS} characters or less (currently ${value.length}, approx. ${estimateIntroWords(value.length)} words)`;
    }
    return null;
  };

  const validateFavouriteSkills = (value: string): string | null => {
    if (!value.trim()) return null;
    const skills = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (skills.length > 3) {
      return `Favourite skills must be 3 or fewer (currently ${skills.length}). Separate with commas.`;
    }
    return null;
  };

  const validateResponsibilities = (value: string): string | null => {
    const responsibilities = value
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    if (responsibilities.length > 3) {
      return `Maximum of 3 responsibilities allowed (currently ${responsibilities.length}).`;
    }

    const tooLongIndex = responsibilities.findIndex((r) => r.length > 40);
    if (tooLongIndex !== -1) {
      const approxWords = Math.max(1, Math.floor(responsibilities[tooLongIndex].length / 8)); // tuned for ~5 words at 40 chars
      return `Responsibility ${tooLongIndex + 1} exceeds 40 characters (currently ${responsibilities[tooLongIndex].length}, approx. ${approxWords} words).`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    if (!validateForm()) {
      alert('Please fix the validation errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      const responsibilitiesArray = formData.responsibilities
        .split('\n')
        .map(r => r.trim())
        .filter(r => r.length > 0);

      const favouriteSkillsArray = formData.favourite_skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const payload = {
        ...formData,
        image: formData.image ? formData.image : null,
        joined_year: formData.joined_year === '' ? null : (typeof formData.joined_year === 'string' ? parseInt(formData.joined_year) : formData.joined_year),
        responsibilities: responsibilitiesArray.length > 0 ? responsibilitiesArray : null,
        favourite_skills: favouriteSkillsArray.length > 0 ? favouriteSkillsArray : null,
      };

      const url = isEditing ? `/api/executives/${executive.id}` : '/api/executives';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save executive');
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving executive:', error);
      alert(error.message || 'Failed to save executive. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any;
    
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'joined_year') {
      // Handle year input - allow empty string, convert to number only when valid
      newValue = value === '' ? '' : (parseInt(value) || '');
    } else {
      newValue = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate as user types
    let error: string | null = null;
    if (name === 'name') {
      error = validateName(value);
    } else if (name === 'bio') {
      error = validateBio(value);
    } else if (name === 'introduction') {
      error = validateIntroduction(value);
    } else if (name === 'favourite_skills') {
      error = validateFavouriteSkills(value);
    } else if (name === 'responsibilities') {
      error = validateResponsibilities(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: error || '',
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const bioError = validateBio(formData.bio);
    if (bioError) newErrors.bio = bioError;

    const introError = validateIntroduction(formData.introduction);
    if (introError) newErrors.introduction = introError;

    const skillsError = validateFavouriteSkills(formData.favourite_skills);
    if (skillsError) newErrors.favourite_skills = skillsError;

    const responsibilitiesError = validateResponsibilities(formData.responsibilities);
    if (responsibilitiesError) newErrors.responsibilities = responsibilitiesError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-[1500px] max-h-[92vh] overflow-y-auto bg-surface-card">
        <CardContent className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Executive' : 'Add Executive'}
            </h2>
            <button
              onClick={onClose}
              className="relative z-50 p-2 hover:bg-surface-card-hover rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 items-start">
            <form onSubmit={handleSubmit} className="space-y-4 order-1">
              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background-secondary border border-border-default rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="exec-001"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Name (max 32 characters ≈ 4-5 words) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                      errors.name ? 'border-red-500' : 'border-border-default focus:border-primary-500'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-400 mt-1 block">{errors.name}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Position <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background-secondary border border-border-default rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="President"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background-secondary border border-border-default rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="Executive"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Joined Year <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="joined_year"
                    value={formData.joined_year}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{4}"
                    maxLength={4}
                    className="w-full px-4 py-2 bg-background-secondary border border-border-default rounded-lg text-white focus:outline-none focus:border-primary-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="2025"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                  <input
                    type="checkbox"
                    name="is_co_founder"
                    checked={formData.is_co_founder}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_co_founder: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  Co-Founder
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Bio (Short - Max 50 characters ≈ 8 words) <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={2}
                  maxLength={50}
                  required
                  className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                    errors.bio ? 'border-red-500' : 'border-border-default focus:border-primary-500'
                  }`}
                  placeholder="Short biography..."
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${errors.bio ? 'text-red-400' : 'text-text-secondary'}`}>
                    {formData.bio.length}/50 characters (~{estimateWordsFromCharacters(formData.bio.length)} words)
                  </span>
                  {errors.bio && (
                    <span className="text-xs text-red-400">{errors.bio}</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-center mb-3 space-y-1">
                  <label className="block text-sm font-medium text-white">
                    Profile Photo <span className="text-text-secondary text-xs">(optional)</span>
                  </label>
                  <p className="text-xs text-text-secondary">
                    Recommended: 512x512px, square crop. Accepted formats: JPEG, PNG, WebP (max 20MB).
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4 md:gap-5 rounded-2xl bg-background-secondary/40 p-5">
                  <div className="relative w-28 h-28 md:w-32 md:h-32">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        fill
                        className="object-cover rounded-full border-4 border-primary-500/40 shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full border-2 border-dashed border-border-default/60 bg-background-tertiary/60 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-text-tertiary" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-3 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileSelect}
                      disabled={uploading}
                      className="hidden"
                      id="image-upload"
                    />

                    <label
                      htmlFor="image-upload"
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                        uploadError
                          ? 'border-red-500/80 text-red-300 hover:border-red-500'
                          : 'border-border-default/80 text-white hover:border-primary-500 hover:text-primary-300'
                      } ${uploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-primary-400" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-primary-400" />
                          {imagePreview ? 'Change Photo' : 'Upload Photo'}
                        </>
                      )}
                    </label>

                    {uploadError && (
                      <p className="mt-2 text-sm text-red-400">{uploadError}</p>
                    )}

                    {selectedFile && !uploadError && (
                      <p className="text-xs text-text-secondary">
                        Selected: <span className="text-white font-medium">{selectedFile.name}</span>
                      </p>
                    )}

                    {(imagePreview || formData.image) && !uploading && (
                      <button
                        type="button"
                        onClick={handleClearExistingImage}
                        className="text-xs text-red-400 hover:text-red-300 underline underline-offset-4 transition-colors"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="hidden"
                  name="image"
                  value={formData.image}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Introduction (700-750 characters ≈ 112-120 words) <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleChange}
                  rows={5}
                  required
                  className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                    errors.introduction ? 'border-red-500' : 'border-border-default focus:border-primary-500'
                  }`}
                  placeholder="Full introduction paragraph for expanded view..."
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${
                    errors.introduction || formData.introduction.length < MIN_INTRO_CHARACTERS ? 'text-red-400' : 'text-text-secondary'
                  }`}>
                    {formData.introduction.length}/{MAX_INTRO_CHARACTERS} characters (~{estimateIntroWords(formData.introduction.length)} words)
                    {formData.introduction.length > 0 && formData.introduction.length < MIN_INTRO_CHARACTERS && (
                      <span className="ml-2">(minimum {MIN_INTRO_CHARACTERS})</span>
                    )}
                  </span>
                  {errors.introduction && (
                    <span className="text-xs text-red-400">{errors.introduction}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Key Responsibilities (max 3 lines, 40 characters each ≈ 5 words) <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows={4}
                  required
                  className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                    errors.responsibilities ? 'border-red-500 focus:border-red-500' : 'border-border-default focus:border-primary-500'
                  }`}
                  placeholder="Responsibility 1&#10;Responsibility 2&#10;Responsibility 3"
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${
                    errors.responsibilities ? 'text-red-400' : 'text-text-secondary'
                  }`}>
                    {formData.responsibilities
                      .split('\n')
                      .map(r => r.trim())
                      .filter(r => r.length > 0).length}/3 responsibilities (~5 words per line)
                  </span>
                  {errors.responsibilities && (
                    <span className="text-xs text-red-400">{errors.responsibilities}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Degree <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background-secondary border border-border-default rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="BSc Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Favourite Skills (Max 3, comma-separated) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="favourite_skills"
                  value={formData.favourite_skills}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 bg-background-secondary border rounded-lg text-white focus:outline-none ${
                    errors.favourite_skills ? 'border-red-500' : 'border-border-default focus:border-primary-500'
                  }`}
                  placeholder="Handstand, L-Sit, Muscle-Up"
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${
                    errors.favourite_skills ? 'text-red-400' : 'text-text-secondary'
                  }`}>
                    {formData.favourite_skills.split(',').map(s => s.trim()).filter(s => s.length > 0).length}/3 skills
                  </span>
                  {errors.favourite_skills && (
                    <span className="text-xs text-red-400">{errors.favourite_skills}</span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background-secondary border border-border-default rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background-secondary border border-border-default rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    isEditing ? 'Update Executive' : 'Add Executive'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 bg-background-secondary hover:bg-background-tertiary text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>

            <div className="order-2 mt-0 lg:-mt-[3rem] lg:order-2 space-y-2.5 lg:space-y-3.5 flex flex-col items-center lg:items-start pointer-events-none">
              <div className="w-full max-w-[800px] lg:self-start">
                <h3 className="text-2xl font-bold text-white">Expanded Card Preview</h3>
                <p className="text-sm md:text-[15px] text-text-muted leading-relaxed">
                  This preview updates as you type so you can check spacing and layout before saving.
                </p>
              </div>
              <ExecutivePreview executive={previewExecutive} className="lg:self-start pointer-events-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

