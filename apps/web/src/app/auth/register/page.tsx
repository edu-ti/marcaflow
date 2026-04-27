'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de cadastro MVP
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <Card className="mt-8 border-slate-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-slate-900">Criar nova conta</h3>
          <p className="text-sm text-slate-500 mt-1">Já tem uma conta? <Link href="/auth/login" className="text-primary hover:underline">Entrar</Link></p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" placeholder="Seu nome" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email de trabalho</Label>
            <Input id="email" type="email" placeholder="nome@empresa.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required minLength={6} placeholder="Mínimo de 6 caracteres" />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta e Workspace'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
