import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('deve renderizar o input corretamente', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('deve aceitar valor digitado', async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  });

  it('deve estar desabilitado quando disabled=true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('deve aplicar type corretamente', () => {
    const { container } = render(<Input type="password" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });
});
