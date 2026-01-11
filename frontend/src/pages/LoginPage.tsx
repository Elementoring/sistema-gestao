import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Loader2, Eye, EyeOff, Shield, TrendingUp, Users, FileText, Lock, ChevronRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ username, password });
      setUser({ ...response.user, active: true, created_at: new Date().toISOString() });
      setToken(response.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: TrendingUp, text: 'Gestão Inteligente', color: 'text-blue-600' },
    { icon: Users, text: 'Multi-usuários', color: 'text-purple-600' },
    { icon: FileText, text: 'Relatórios Completos', color: 'text-green-600' },
    { icon: Shield, text: 'Segurança Total', color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className={`hidden lg:block space-y-8 transform transition-all duration-1000 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Building2 className="w-11 h-11 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white tracking-tight">
                    Cred Management
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> +</span>
                  </h1>
                  <p className="text-blue-200 text-sm font-medium">Versão Premium 2.0</p>
                </div>
              </div>

              <h2 className="text-5xl font-black text-white leading-tight">
                Gestão de Crédito
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Profissional
                </span>
              </h2>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Plataforma completa para gerenciar clientes, propostas e comissões com inteligência artificial e automação.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`${feature.color} mb-2`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <p className="text-white font-semibold text-sm">{feature.text}</p>
                  <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/50 rounded-xl transition-all duration-300"></div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-white">10+</p>
                <p className="text-blue-200 text-sm">Funcionalidades</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-blue-200 text-sm">Seguro</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-blue-200 text-sm">Disponível</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={`transform transition-all duration-1000 delay-300 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              
              {/* Card */}
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Top Accent */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <div className="p-8 md:p-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-4">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Acesso Restrito
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Bem-vindo de volta!
                    </h2>
                    <p className="text-gray-600">
                      Entre com suas credenciais para acessar
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-700 font-semibold">
                        Usuário
                      </Label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity"></div>
                        <Input
                          id="username"
                          type="text"
                          placeholder="admin"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="relative h-12 px-4 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-semibold">
                        Senha
                      </Label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity"></div>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="relative h-12 px-4 pr-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2 animate-shake">
                        <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-[length:200%_auto] hover:bg-right-bottom group"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Autenticando...
                        </>
                      ) : (
                        <>
                          Entrar no Sistema
                          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Sistema de uso interno</span>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">
                      Entre em contato com o administrador para criar conta
                    </p>
                  </div>
                </div>

                {/* Bottom Shine Effect */}
                <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              </div>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden mt-8 text-center">
              <p className="text-white/60 text-sm">
                © 2026 Cred Management+. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}
