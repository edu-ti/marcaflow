import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-3xl text-primary mb-4">
            <Sparkles className="w-8 h-8" />
            MarcaFlow
          </Link>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Ou{' '}
            <Link href="/auth/register" className="font-medium text-primary hover:text-indigo-500">
              crie seu workspace grátis hoje
            </Link>
          </p>
        </div>
        
        {children}
      </div>
    </div>
  );
}
