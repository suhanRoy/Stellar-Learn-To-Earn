import { NextResponse } from 'next/server';
import { rpc, TransactionBuilder, Networks, Keypair, Asset, Operation } from '@stellar/stellar-sdk';

const TESTNET_RPC = "https://soroban-testnet.stellar.org";
const server = new rpc.Server(TESTNET_RPC);

const TREASURY_SECRET = process.env.TREASURY_SECRET_KEY || "SDVFYRAUWFBZ5TNJNNNXROVQEW5V4B57ZETGH7TNDVGVVICTSU45ENDM";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, amount } = body;

    if (!address || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid address or amount" }, { status: 400 });
    }

    // Load treasury keypair
    const treasuryKeypair = Keypair.fromSecret(TREASURY_SECRET);

    // Get treasury account sequence number
    const treasuryAccount = await server.getAccount(treasuryKeypair.publicKey());

    // Build XLM payment transaction
    // 1 LRN = 1 XLM conversion rate for the Learn-to-Earn platform
    const tx = new TransactionBuilder(treasuryAccount, {
      fee: "1000",
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: address,
          asset: Asset.native(),
          amount: amount.toString(), // amount in XLM
        })
      )
      .setTimeout(30)
      .build();

    // Sign transaction with treasury key
    tx.sign(treasuryKeypair);

    // Submit transaction
    const sendResult = await server.sendTransaction(tx);

    if (sendResult.status === "ERROR") {
      throw new Error("Failed to submit transaction to the network.");
    }

    // Poll until success
    let statusResult = await server.getTransaction(sendResult.hash);
    let attempts = 0;
    while (statusResult.status === "NOT_FOUND" && attempts < 15) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      statusResult = await server.getTransaction(sendResult.hash);
      attempts++;
    }

    if (statusResult.status === "SUCCESS") {
      return NextResponse.json({ success: true, txHash: sendResult.hash });
    } else {
      throw new Error(`Transaction failed: ${statusResult.status}`);
    }

  } catch (error: any) {
    console.error("Treasury withdrawal failed:", error);
    return NextResponse.json({ error: error.message || "Failed to process withdrawal" }, { status: 500 });
  }
}
