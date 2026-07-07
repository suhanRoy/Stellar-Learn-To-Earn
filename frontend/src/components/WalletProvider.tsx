"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  StellarWalletsKit,
  Networks,
} from "@creit.tech/stellar-wallets-kit";
import { FreighterModule, FREIGHTER_ID } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { xBullModule, XBULL_ID } from "@creit.tech/stellar-wallets-kit/modules/xbull";
import { AlbedoModule, ALBEDO_ID } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { LobstrModule, LOBSTR_ID } from "@creit.tech/stellar-wallets-kit/modules/lobstr";
import { HanaModule, HANA_ID } from "@creit.tech/stellar-wallets-kit/modules/hana";

interface WalletContextType {
  address: string | null;
  balance: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

async function fetchXLMBalance(address: string): Promise<string> {
  try {
    const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}`);
    if (!res.ok) return "0.00";
    const data = await res.json();
    const native = data.balances?.find((b: { asset_type: string }) => b.asset_type === "native");
    return native ? parseFloat(native.balance).toFixed(2) : "0.00";
  } catch {
    return "0.00";
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0.00");
  const [isConnecting, setIsConnecting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    StellarWalletsKit.init({
      network: Networks.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: [
        new FreighterModule(),
        new xBullModule(),
        new AlbedoModule(),
        new LobstrModule(),
        new HanaModule(),
      ],
    });
    setInitialized(true);
    
    // Auto-reconnect from localStorage
    const savedAddress = localStorage.getItem("learn_to_earn_wallet");
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  // Fetch balance when address changes, and poll every 15s
  useEffect(() => {
    if (!address) {
      setBalance("0.00");
      return;
    }
    fetchXLMBalance(address).then(setBalance);
    const interval = setInterval(() => {
      fetchXLMBalance(address).then(setBalance);
    }, 15000);
    return () => clearInterval(interval);
  }, [address]);

  const connect = useCallback(async () => {
    if (!initialized) return;
    setIsConnecting(true);
    try {
      const { address: walletAddress } = await StellarWalletsKit.authModal();
      setAddress(walletAddress);
      localStorage.setItem("learn_to_earn_wallet", walletAddress);
    } catch (e) {
      console.error("Wallet connection failed:", e);
    } finally {
      setIsConnecting(false);
    }
  }, [initialized]);

  const disconnect = useCallback(async () => {
    try {
      await StellarWalletsKit.disconnect();
    } catch {
      // safe to ignore
    }
    setAddress(null);
    localStorage.removeItem("learn_to_earn_wallet");
  }, []);

  return (
    <WalletContext.Provider value={{ address, balance, connect, disconnect, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
