import { ReactNode } from 'react';
import { Shield, Zap, Database, Key, Server, CheckCircle } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          </div>
          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
      
      {/* Right side: Feature Showcase */}
      <div className="hidden lg:flex flex-1 bg-slate-950 relative overflow-hidden flex-col justify-center px-16 xl:px-24">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-950/90 mix-blend-multiply" />
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-primary-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000" />
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-4000" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Enterprise-Grade Backend Architecture
          </div>
          
          <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Powered by a Scalable Core Engine.
          </h2>
          <p className="text-lg text-slate-300 mb-12 max-w-xl">
            PrimeTrade's backend is engineered for high performance, uncompromising security, and seamless developer experience.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <Shield className="w-8 h-8 text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">JWT & RBAC Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dual-token auth system with HttpOnly refresh cookies and strict Role-Based Access Control middleware.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <Database className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">PostgreSQL + Prisma</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Type-safe ORM integration with optimized indexing for lightning-fast trade signal queries.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <Server className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Resilient Monolith</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Express.js architecture fortified with strict Rate Limiting, Helmet headers, and graceful error handling.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <Key className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Zod Validation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bulletproof end-to-end schema validation ensuring 100% data integrity before hitting the database.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
