import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '../../store/resumeStore';
import { useEffect } from 'react';
import { User, Upload } from 'lucide-react';

const schema = z.object({
  firstName:  z.string().min(1, 'Required'),
  lastName:   z.string().min(1, 'Required'),
  email:      z.string().email('Invalid email'),
  phone:      z.string().optional(),
  location:   z.string().optional(),
  website:    z.string().optional(),
  linkedin:   z.string().optional(),
  github:     z.string().optional(),
});

function FormInput({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <input
        {...props}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function PersonalForm() {
  const personalInfo = useResumeStore((s) => s.resumeData.personalInfo);
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo);

  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: personalInfo,
  });

  // Watch all fields and sync to global store immediately
  const values = watch();
  useEffect(() => {
    updatePersonalInfo(values);
  }, [JSON.stringify(values)]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold flex items-center gap-2">
          <User className="h-4 w-4 text-primary" /> Personal Information
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Your core contact details.</p>
      </div>

      {/* Profile Photo placeholder */}
      <div className="flex items-center gap-4 rounded-xl border border-dashed border-border p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted">
          {personalInfo.profilePhoto
            ? <img src={personalInfo.profilePhoto} alt="profile" className="h-full w-full rounded-full object-cover" />
            : <User className="h-7 w-7 text-muted-foreground" />
          }
        </div>
        <div>
          <p className="text-sm font-medium">Profile Photo</p>
          <p className="text-xs text-muted-foreground">JPG, PNG up to 2MB</p>
          <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors">
            <Upload className="h-3 w-3" /> Upload
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput label="First Name" placeholder="John" error={errors.firstName?.message} {...register('firstName')} />
        <FormInput label="Last Name" placeholder="Doe" error={errors.lastName?.message} {...register('lastName')} />
      </div>
      <FormInput label="Email" placeholder="john@example.com" error={errors.email?.message} {...register('email')} />
      <div className="grid grid-cols-2 gap-4">
        <FormInput label="Phone" placeholder="+91 9876543210" {...register('phone')} />
        <FormInput label="Location" placeholder="Bangalore, India" {...register('location')} />
      </div>
      <FormInput label="Website / Portfolio" placeholder="https://johndoe.dev" {...register('website')} />
      <div className="grid grid-cols-2 gap-4">
        <FormInput label="LinkedIn" placeholder="linkedin.com/in/johndoe" {...register('linkedin')} />
        <FormInput label="GitHub" placeholder="github.com/johndoe" {...register('github')} />
      </div>
    </div>
  );
}
