import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Sparkles, Palette, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { FormInput, SubmitButton } from '../components/AuthFormComponents';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

const schema = z.object({
  profession: z.string().min(2, 'Profession / Job Title is required'),
  headline:   z.string().min(10, 'Write at least 10 characters describing yourself'),
});

const PROFESSIONS = ['Software Engineer', 'Product Manager', 'Designer', 'Student', 'Marketer', 'Other'];

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { profession: '', headline: '' },
  });

  const selectedProfession = watch('profession');

  const onSubmit = async (data) => {
    // In production, send updates to backend user model
    updateUser({ ...data });
    toast.success('Profile setup complete!');
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Let's set up your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Help us personalize your resume building experience.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Profession chips */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
            Select Profession
          </label>
          <div className="flex flex-wrap gap-2">
            {PROFESSIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setValue('profession', p, { shouldValidate: true })}
                className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-all ${
                  selectedProfession === p
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:bg-muted'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          {errors.profession && <p className="text-xs text-destructive mt-1.5">{errors.profession.message}</p>}
        </div>

        <FormInput
          label="Custom Title"
          type="text"
          placeholder="e.g. Full Stack Developer"
          icon={Briefcase}
          error={errors.profession?.message}
          {...register('profession')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Professional Headline
          </label>
          <textarea
            placeholder="A passionate developer skilled in building accessible React web apps..."
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
            {...register('headline')}
          />
          {errors.headline && <p className="text-xs text-destructive">{errors.headline.message}</p>}
        </div>

        {/* Theme preference */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
            Theme Preference
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'light', label: 'Light Mode' },
              { id: 'dark',  label: 'Dark Mode' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 text-sm font-semibold transition-all ${
                  theme === t.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:bg-muted'
                }`}
              >
                <Palette className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <SubmitButton>Finish Setup</SubmitButton>
      </form>
    </motion.div>
  );
}
