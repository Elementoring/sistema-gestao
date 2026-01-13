import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('deve renderizar o botão corretamente', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('deve aplicar a variante correta', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('deve estar desabilitado quando disabled=true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });
});
