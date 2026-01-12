import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  user?: any;
}

export default function UserModal({ open, onClose, onSave, user }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [active, setActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setFullName(user.full_name);
      setRole(user.role);
      setActive(user.active);
      setPassword('');
      setConfirmPassword('');
    } else {
      resetForm();
    }
  }, [user, open]);

  const resetForm = () => {
    setUsername('');
    setFullName('');
    setPassword('');
    setConfirmPassword('');
    setRole('user');
    setActive(true);
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!user && !password) {
      setError('Senha é obrigatória para novos usuários');
      return;
    }

    if (password && password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const data: any = {
        username,
        full_name: fullName,
        role,
        active,
      };

      // Só incluir a senha se foi preenchida
      if (password) {
        data.password = password;
      }

      await onSave(data);
      resetForm();
    } catch (error: any) {
      setError(error.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          <DialogDescription id="user-modal-description">
            {user ? 'Edite as informações do usuário abaixo' : 'Preencha os dados para criar um novo usuário'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="username">Nome de Usuário *</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="usuario123"
              required
              disabled={!!user} // Username não pode ser alterado após criação
            />
            {user && (
              <p className="text-xs text-gray-500 mt-1">
                O nome de usuário não pode ser alterado
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="fullName">Nome Completo *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="João Silva"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">
              {user ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha *'}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                autoComplete="new-password"
                required={!user}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Mínimo de 6 caracteres
            </p>
          </div>

          {password && (
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="role">Função *</Label>
            <Select value={role} onValueChange={(value: any) => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <span>👤</span>
                    <div>
                      <div className="font-medium">Usuário</div>
                      <div className="text-xs text-gray-500">
                        Pode criar, ler e atualizar dados
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <span>🛡️</span>
                    <div>
                      <div className="font-medium">Administrador</div>
                      <div className="text-xs text-gray-500">
                        Acesso total ao sistema (incluindo excluir)
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {user && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="active" className="cursor-pointer">
                  Status do Usuário
                </Label>
                <p className="text-sm text-gray-500">
                  {active ? 'Usuário ativo no sistema' : 'Usuário desativado'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  active ? 'bg-green-600' : 'bg-gray-200'
                }`}
                aria-label={active ? 'Desativar usuário' : 'Ativar usuário'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Usuário'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
