import {
  rpc,
  TransactionBuilder,
  Networks,
  Address,
  xdr,
  scValToNative,
  nativeToScVal,
  Operation,
} from "@stellar/stellar-sdk";

export const TESTNET_RPC = "https://soroban-testnet.stellar.org";
export const TESTNET_NETWORK_PASSPHRASE = Networks.TESTNET;

const server = new rpc.Server(TESTNET_RPC);

// Note: In Phase 8 we will replace these placeholders with real testnet addresses
export const CONTRACT_COURSE_MANAGER = process.env.NEXT_PUBLIC_COURSE_MANAGER_ID || "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2M";
export const CONTRACT_REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN_ID || "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2T";

/**
 * Parses SCVal to JS native types
 */
export function parseScVal(val: xdr.ScVal) {
  try {
    return scValToNative(val);
  } catch (e) {
    console.error("Error parsing SCVal:", e);
    return null;
  }
}

/**
 * Get account details
 */
export async function getAccount(publicKey: string) {
  return await server.getAccount(publicKey);
}

/**
 * Prepares a generic Soroban transaction
 */
export async function buildContractTransaction(
  publicKey: string,
  contractId: string,
  method: string,
  args: xdr.ScVal[] = []
) {
  const account = await getAccount(publicKey);

  const tx = new TransactionBuilder(account, {
    fee: "1000",
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.invokeHostFunction({
        func: xdr.HostFunction.hostFunctionTypeInvokeContract(
          new xdr.InvokeContractArgs({
            contractAddress: Address.fromString(contractId).toScAddress(),
            functionName: method,
            args,
          })
        ),
        auth: [],
      })
    )
    .setTimeout(30)
    .build();

  const simulated = await server.simulateTransaction(tx);
  
  if (rpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  if (
    !simulated.transactionData ||
    !simulated.minResourceFee
  ) {
    throw new Error("Invalid simulation response");
  }

  // Assemble the assembled transaction
  const assembledTx = rpc.assembleTransaction(tx, simulated);

  return assembledTx.build();
}

/**
 * Poll transaction status
 */
export async function pollTransactionStatus(hash: string) {
  let status: rpc.Api.GetTransactionResponse;
  
  // Poll for up to 30 seconds
  for (let i = 0; i < 30; i++) {
    status = await server.getTransaction(hash);
    if (status.status !== "NOT_FOUND") {
      return status;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  throw new Error("Transaction polling timed out.");
}
