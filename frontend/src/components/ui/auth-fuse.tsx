"use client";

import * as React from "react";
import { useState, useId, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, Shield, Database, Zap, Key } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input dark:border-input/50 bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-6",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input dark:border-input/50 bg-background px-3 py-3 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:bg-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    return (
      <div className="grid w-full items-center gap-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input id={id} type={showPassword ? "text" : "password"} className={cn("pe-10", className)} ref={ref} {...props} />
          <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? (<EyeOff className="size-4" aria-hidden="true" />) : (<Eye className="size-4" aria-hidden="true" />)}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

function SignInForm() {
  const [email, setEmail] = useState("admin@primetrade.ai");
  const [password, setPassword] = useState("Admin@123");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        login(data.data.user, data.data.accessToken);
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} autoComplete="on" className="flex flex-col gap-8 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 bg-primary-600/10 rounded-xl flex items-center justify-center mb-2 border border-primary-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Zap className="w-6 h-6 text-primary-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to access the dashboard</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input id="signin-email" name="email" type="email" placeholder="admin@primetrade.ai" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <PasswordInput name="password" label="Password" required autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="default" className="mt-4 shadow-lg shadow-primary-600/20" disabled={loading}>
          {loading ? "Authenticating..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { email, password, name });
      if (data.success) {
        login(data.data.user, data.data.accessToken);
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          toast.error(`${err.message}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} autoComplete="on" className="flex flex-col gap-8 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 bg-primary-600/10 rounded-xl flex items-center justify-center mb-2 border border-primary-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Zap className="w-6 h-6 text-primary-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
        <p className="text-sm text-muted-foreground">Join PrimeTrade to receive alpha signals</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="signup-name">Full Name</Label>
          <Input id="signup-name" name="name" type="text" placeholder="John Doe" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" name="email" type="email" placeholder="user@example.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <PasswordInput name="password" label="Password" required autoComplete="new-password" placeholder="Min 8 chars, 1 uppercase, 1 number" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="default" className="mt-4 shadow-lg shadow-primary-600/20" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
}

function AuthFormContainer({ isSignIn, onToggle }: { isSignIn: boolean; onToggle: () => void; }) {
    return (
        <div className="mx-auto w-full px-6 flex flex-col justify-center">
            {isSignIn ? <SignInForm /> : <SignUpForm />}
            <div className="text-center text-sm mt-8">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
                <Button variant="link" className="pl-1 text-primary-500 font-semibold" onClick={onToggle}>
                    {isSignIn ? "Create one now" : "Sign in here"}
                </Button>
            </div>
        </div>
    )
}

// Backend Features derived from PRD.md
const backendFeatures = [
  {
    icon: <Shield className="w-16 h-16 text-primary-400 mb-6 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />,
    title: "Dual-Token Security",
    description: "Enterprise-grade authentication utilizing short-lived JWT access tokens and HttpOnly refresh cookies to eliminate XSS attack vectors.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
  },
  {
    icon: <Key className="w-16 h-16 text-purple-400 mb-6 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]" />,
    title: "Strict RBAC System",
    description: "Granular Role-Based Access Control ensuring only authenticated Administrators can mutate, edit, or broadcast trade signals.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
  },
  {
    icon: <Database className="w-16 h-16 text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />,
    title: "PostgreSQL & Prisma",
    description: "Fully typed, highly optimized relational database interactions ensuring data integrity, rapid queries, and seamless scalability.",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop"
  },
  {
    icon: <Zap className="w-16 h-16 text-amber-400 mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />,
    title: "Resilient Monolith Engine",
    description: "Robust Node.js & Express architecture fortified with end-to-end Zod validation, Helmet security headers, and brute-force Rate Limiting.",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop"
  }
];

export function AuthUI() {
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => setIsSignIn((prev) => !prev);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backendFeatures.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dark w-full min-h-screen flex flex-col md:flex-row bg-background text-foreground selection:bg-primary-500/30">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      {/* Carousel Section (Left side on Desktop, Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-slate-950 items-center justify-center">
        {backendFeatures.map((feat, idx) => (
          <div 
            key={idx}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out",
              currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            style={{ backgroundImage: `url(${feat.image})` }}
          >
             {/* Gradient Overlays for readability and mood */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
            
            {/* Carousel Content */}
            <div className={cn(
              "relative z-20 flex flex-col justify-center items-start w-full h-full p-16 xl:p-24 transition-all duration-700 delay-100",
              currentSlide === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-8 backdrop-blur-md">
                {feat.icon}
              </div>
              <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight max-w-lg">
                {feat.title}
              </h2>
              <p className="text-lg xl:text-xl text-slate-300 max-w-xl leading-relaxed font-light">
                {feat.description}
              </p>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-16 xl:left-24 z-30 flex gap-3">
          {backendFeatures.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-500 ease-in-out", 
                currentSlide === idx ? "bg-primary-500 w-10 shadow-[0_0_10px_rgba(59,130,246,0.8)]" : "bg-white/30 hover:bg-white/50 w-3"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Form Section (Right side on Desktop, Full width on Mobile) */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col h-screen justify-center items-center relative z-10 bg-background border-l border-white/5">
        <AuthFormContainer isSignIn={isSignIn} onToggle={toggleForm} />
      </div>
      
    </div>
  );
}
