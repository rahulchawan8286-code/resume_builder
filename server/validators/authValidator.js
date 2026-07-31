const { z } = require('zod');

exports.registerSchema = {
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email format"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
  })
};

exports.loginSchema = {
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional()
  })
};

exports.forgotPasswordSchema = {
  body: z.object({
    email: z.string().email("Invalid email format")
  })
};

exports.resetPasswordSchema = {
  params: z.object({
    token: z.string()
  }),
  body: z.object({
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
  })
};

exports.updateProfileSchema = {
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    phone: z.string().max(20).optional(),
    college: z.string().optional(),
    branch: z.string().optional(),
    graduationYear: z.number().optional(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    portfolio: z.string().url().optional(),
    bio: z.string().max(500).optional()
  })
};

exports.changePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
  })
};
