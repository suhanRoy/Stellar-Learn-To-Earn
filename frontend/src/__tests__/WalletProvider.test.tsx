import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  StellarWalletsKit: { init: vi.fn().mockReturnValue({}) },
  WalletNetwork: { TESTNET: 'TESTNET' },
  Networks: { TESTNET: 'TESTNET' },
}));
vi.mock('@creit.tech/stellar-wallets-kit/modules/freighter', () => ({ FreighterModule: vi.fn(), FREIGHTER_ID: 'freighter' }));
vi.mock('@creit.tech/stellar-wallets-kit/modules/xbull', () => ({ xBullModule: vi.fn(), XBULL_ID: 'xbull' }));
vi.mock('@creit.tech/stellar-wallets-kit/modules/albedo', () => ({ AlbedoModule: vi.fn(), ALBEDO_ID: 'albedo' }));
vi.mock('@creit.tech/stellar-wallets-kit/modules/lobstr', () => ({ LobstrModule: vi.fn(), LOBSTR_ID: 'lobstr' }));
vi.mock('@creit.tech/stellar-wallets-kit/modules/hana', () => ({ HanaModule: vi.fn(), HANA_ID: 'hana' }));

import { WalletProvider, useWallet } from '../components/WalletProvider';

const MockChild = () => {
  const { address } = useWallet();
  return <div data-testid="wallet-address">{address || 'No Wallet'}</div>;
};

describe('WalletProvider', () => {
  it('renders children and provides default context', () => {
    render(
      <WalletProvider>
        <MockChild />
      </WalletProvider>
    );
    expect(screen.getByTestId('wallet-address')).toHaveTextContent('No Wallet');
  });
});
