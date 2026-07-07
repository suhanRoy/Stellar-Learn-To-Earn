import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from '../app/dashboard/page';

// Mock the wallet provider hook
vi.mock('@/components/WalletProvider', () => ({
  useWallet: () => ({
    address: 'G1234567890',
    connect: vi.fn(),
  })
}));

describe('Dashboard Page', () => {
  it('renders dashboard correctly for connected user', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
  });
});
