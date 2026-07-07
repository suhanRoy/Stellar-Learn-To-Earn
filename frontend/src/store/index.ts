import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Lesson {
  title: string;
  content: string; // markdown-style content
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  reward: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

export interface CourseProgress {
  lessonsRead: number[]; // indices of lessons read
  quizPassed: boolean;
  quizScore: number | null;
}

export interface TransactionRecord {
  hash: string;
  type: "complete_course" | "mint_reward" | "other";
  status: "pending" | "processing" | "success" | "failed";
  timestamp: number;
  courseTitle?: string;
}

// ─── Course Content ──────────────────────────────────────────────────────────

const COURSES: Course[] = [
  {
    id: 1,
    title: "Intro to Stellar",
    description: "Learn the basics of the Stellar Network — what it is, how consensus works, and why it matters for global payments.",
    reward: 50,
    difficulty: "Beginner",
    lessons: [
      {
        title: "What is Stellar?",
        content: `## What is Stellar?

Stellar is an open-source, decentralized payment network that allows fast, cross-border transactions between any pair of currencies. It was founded in 2014 by Jed McCaleb (co-founder of Ripple).

### Key Features
- **Speed**: Transactions settle in 3-5 seconds
- **Low Cost**: Fees are fractions of a cent (~0.00001 XLM)
- **Energy Efficient**: Uses the Stellar Consensus Protocol (SCP), not proof-of-work
- **Built-in DEX**: Native decentralized exchange for asset trading

### The Native Token: Lumens (XLM)
XLM is the native cryptocurrency of the Stellar network. It serves two purposes:
1. **Anti-spam**: A small amount is required for each transaction
2. **Bridge Currency**: Facilitates cross-currency conversions`
      },
      {
        title: "Stellar Accounts & Keypairs",
        content: `## Stellar Accounts & Keypairs

Every Stellar account is identified by a **keypair** — a public key and a secret key.

### Public Key (Address)
- Starts with \`G\` (e.g., \`GAYP...K6KA\`)
- Safe to share — this is your account address
- Used to receive payments and identify your account on-chain

### Secret Key
- Starts with \`S\` (e.g., \`SCZK...9XYZ\`)
- **Never share this!** It controls your account
- Used to sign transactions

### Account Activation
A Stellar account must hold a **minimum balance** of 1 XLM to exist on the network. This is called the **base reserve**.`
      }
    ],
    quiz: [
      {
        question: "How long does a Stellar transaction typically take to settle?",
        options: ["10 minutes", "3-5 seconds", "1 hour", "30 seconds"],
        correctIndex: 1
      },
      {
        question: "What does XLM stand for in the Stellar ecosystem?",
        options: ["Extra Large Money", "Stellar Lumens", "Cross Ledger Module", "Exchange Liquidity Marker"],
        correctIndex: 1
      },
      {
        question: "What must you create to hold a custom token (like LRN) on Stellar?",
        options: ["A smart contract", "A trustline", "A new account", "A mining node"],
        correctIndex: 1
      }
    ]
  },
  {
    id: 2,
    title: "Stellar Horizon API",
    description: "Learn how to query the Stellar network using the Horizon API to fetch balances, accounts, and transactions.",
    reward: 100,
    difficulty: "Beginner",
    lessons: [
      {
        title: "What is Horizon?",
        content: `## What is Horizon?

Horizon is the client-facing API server for the Stellar ecosystem. It acts as the bridge between applications and Stellar Core.

### Core Functions
- Submit transactions to the network
- Query account balances and history
- Stream real-time events (like payments or trades)

### Endpoints
Horizon provides a RESTful API. For example, to fetch an account:
\`GET https://horizon-testnet.stellar.org/accounts/{account_id}\``
      }
    ],
    quiz: [
      {
        question: "What is the name of the client-facing API server for Stellar?",
        options: ["Stellar Core", "Horizon", "Kelvin", "Aurora"],
        correctIndex: 1
      },
      {
        question: "Which of the following is NOT a function of Horizon?",
        options: ["Submit transactions", "Query balances", "Mine new XLM", "Stream events"],
        correctIndex: 2
      },
      {
        question: "What type of API does Horizon provide?",
        options: ["GraphQL", "RESTful API", "SOAP", "gRPC"],
        correctIndex: 1
      }
    ]
  },
  {
    id: 3,
    title: "Soroban Smart Contracts",
    description: "Deep dive into Rust-based Soroban contracts — the smart contract platform for Stellar with WASM execution.",
    reward: 150,
    difficulty: "Intermediate",
    lessons: [
      {
        title: "What is Soroban?",
        content: `## What is Soroban?

Soroban is Stellar's smart contract platform. It brings programmable logic to the Stellar network using **Rust** and **WebAssembly (WASM)**.

### Why Soroban?
Before Soroban, Stellar only supported basic operations (payments, offers, trustlines). Soroban adds:
- **Turing-complete smart contracts**
- **Predictable gas fees** (you know the cost before submitting)
- **State archival** (unused data is archived to reduce bloat)
- **Cross-contract calls** (contracts can invoke other contracts)`
      },
      {
        title: "Writing Your First Contract",
        content: `## Writing Your First Contract

Soroban contracts are written in Rust. You define a struct and implement methods on it.

### Example Contract
\`\`\`rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> (Symbol, Symbol) {
        (Symbol::new(&env, "Hello"), to)
    }
}
\`\`\`

You must use \`#[contract]\` to mark the struct, and \`#[contractimpl]\` to expose the methods to the network.`
      }
    ],
    quiz: [
      {
        question: "What programming language are Soroban smart contracts written in?",
        options: ["JavaScript", "Solidity", "Rust", "Go"],
        correctIndex: 2
      },
      {
        question: "What binary format do Soroban contracts compile to?",
        options: ["EVM bytecode", "WebAssembly (WASM)", "LLVM IR", "JVM bytecode"],
        correctIndex: 1
      },
      {
        question: "Which attribute marks a struct as a Soroban contract?",
        options: ["#[program]", "#[smart_contract]", "#[contract]", "#[soroban]"],
        correctIndex: 2
      }
    ]
  },
  {
    id: 4,
    title: "Building Custom Tokens",
    description: "Learn how to create and issue your own custom tokens (assets) on the Stellar Network using Soroban.",
    reward: 250,
    difficulty: "Intermediate",
    lessons: [
      {
        title: "Token Standard",
        content: `## Soroban Token Standard

Soroban has a built-in token standard, similar to ERC-20 on Ethereum.

### Built-in Token Contract
Instead of writing a token contract from scratch, Soroban provides a built-in contract that implements the standard token interface. This contract is used for both native XLM and custom tokens.

### Key Operations
- \`mint\`: Create new tokens
- \`transfer\`: Move tokens between accounts
- \`balance\`: Check an account's balance
- \`approve\`: Allow another account to spend your tokens`
      },
      {
        title: "Deploying a Token",
        content: `## Deploying a Token

To deploy a custom token, you use the Soroban CLI to initialize the built-in token contract for a specific asset.

### The Admin
When deploying a custom token, you specify an **Admin** account. Only the Admin can use the \`mint\` function to create new supply, or \`set_admin\` to transfer ownership.

### Trustlines in Soroban
Unlike Classic Stellar, Soroban tokens do not require users to establish a trustline before receiving tokens. The contract handles balances independently.`
      }
    ],
    quiz: [
      {
        question: "Does Soroban have a built-in token standard contract?",
        options: ["Yes, similar to ERC-20", "No, you must write it from scratch", "Yes, but only for XLM", "No, tokens are not supported"],
        correctIndex: 0
      },
      {
        question: "Which operation creates new tokens?",
        options: ["transfer", "mint", "approve", "burn"],
        correctIndex: 1
      },
      {
        question: "What does the `approve` operation do?",
        options: ["Verifies a user's identity", "Allows another account to spend your tokens", "Deploys a contract", "Mints new tokens"],
        correctIndex: 1
      }
    ]
  },
  {
    id: 5,
    title: "Advanced State Management",
    description: "Understand Soroban's state archival model, temporary storage, and how to optimize contract data costs.",
    reward: 350,
    difficulty: "Advanced",
    lessons: [
      {
        title: "Storage Types",
        content: `## Soroban Storage Types

Soroban offers three types of storage for contracts:

1. **Persistent Storage**: Data that must be kept indefinitely (e.g., user balances). This data can be archived if rent is not paid.
2. **Temporary Storage**: Data that can be discarded after a short period (e.g., price oracles). It is cheaper but will eventually be deleted.
3. **Instance Storage**: Data attached to the contract instance itself (e.g., admin address). Shared across all calls to the contract.`
      },
      {
        title: "State Archival & Rent",
        content: `## State Archival & Rent

To prevent the blockchain from bloating infinitely, Soroban introduces **State Archival**.

### Rent
Contracts must pay rent to keep their Persistent or Instance data active on the ledger. Rent is paid in XLM.

### Restoration
If a piece of data runs out of rent, it is not deleted forever—it is **Archived**. Archived data cannot be read by contracts until a user pays a fee to **restore** it to the active ledger.`
      }
    ],
    quiz: [
      {
        question: "Which storage type is best for user balances?",
        options: ["Temporary", "Persistent", "Instance", "Volatile"],
        correctIndex: 1
      },
      {
        question: "What happens to persistent storage if rent is not paid?",
        options: ["It is deleted forever", "It is archived", "It becomes read-only", "Nothing happens"],
        correctIndex: 1
      },
      {
        question: "Which storage type is attached directly to the contract instance?",
        options: ["Temporary", "Persistent", "Instance", "Global"],
        correctIndex: 2
      }
    ]
  },
  {
    id: 6,
    title: "Orange Belt Challenge",
    description: "Master cross-contract calls and deploy a full-stack dApp to the Stellar Testnet.",
    reward: 500,
    difficulty: "Advanced",
    lessons: [
      {
        title: "Cross-Contract Calls",
        content: `## Cross-Contract Calls in Soroban

One of Soroban's most powerful features is the ability for contracts to call other contracts.

### How It Works
You import another contract's WASM and call its methods:

\`\`\`rust
mod token {
    soroban_sdk::contractimport!(
        file = "../target/wasm32v1-none/release/reward_token.wasm"
    );
}

// Then call it:
let token_client = token::Client::new(&env, &token_contract_id);
token_client.mint(&recipient, &amount);
\`\`\``
      },
      {
        title: "Deploying to Testnet",
        content: `## Deploying to Testnet

To bring your dApp to the world, you must deploy the compiled WASM to the Stellar Testnet.

### Two-Step Process
1. **Install**: Upload the WASM file to the network. The network returns a WASM Hash.
2. **Deploy**: Instantiate a contract using the WASM Hash. This creates a unique Contract ID.

You can deploy multiple contracts using the same WASM Hash, which saves network fees and storage space!`
      }
    ],
    quiz: [
      {
        question: "What macro is used to import another contract's WASM for cross-contract calls?",
        options: ["contractimport!", "import_wasm!", "use_contract!", "wasm_import!"],
        correctIndex: 0
      },
      {
        question: "What CLI command deploys a Soroban contract to testnet?",
        options: ["stellar deploy", "stellar contract deploy", "soroban upload", "stellar push"],
        correctIndex: 1
      },
      {
        question: "What does `require_auth()` do in a Soroban contract?",
        options: [
          "Creates a new account",
          "Verifies the caller has signed the transaction",
          "Checks the contract balance",
          "Deploys the contract"
        ],
        correctIndex: 1
      }
    ]
  }
];

// ─── Store ───────────────────────────────────────────────────────────────────

interface AppState {
  courses: Course[];
  // We map completed courses, transactions, and progress by user wallet address
  // to ensure they don't vanish on refresh and stay tied to the user.
  completedCoursesByWallet: Record<string, number[]>;
  transactionsByWallet: Record<string, TransactionRecord[]>;
  courseProgressByWallet: Record<string, Record<number, CourseProgress>>;
  withdrawnAmountByWallet: Record<string, number>;

  // Actions
  addTransaction: (wallet: string, tx: TransactionRecord) => void;
  updateTransaction: (wallet: string, hash: string, updates: Partial<TransactionRecord>) => void;
  markCourseCompleted: (wallet: string, courseId: number) => void;
  markLessonRead: (wallet: string, courseId: number, lessonIndex: number) => void;
  markQuizPassed: (wallet: string, courseId: number, score: number) => void;
  recordWithdrawal: (wallet: string, amount: number) => void;
  getCourseProgress: (wallet: string, courseId: number) => CourseProgress;
  getCompletedCourses: (wallet: string) => number[];
  getTransactions: (wallet: string) => TransactionRecord[];
  getWithdrawnAmount: (wallet: string) => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      courses: COURSES,
      completedCoursesByWallet: {},
      transactionsByWallet: {},
      courseProgressByWallet: {},
      withdrawnAmountByWallet: {},

      addTransaction: (wallet, tx) =>
        set((state) => {
          const txs = state.transactionsByWallet[wallet] || [];
          return {
            transactionsByWallet: {
              ...state.transactionsByWallet,
              [wallet]: [tx, ...txs],
            },
          };
        }),

      updateTransaction: (wallet, hash, updates) =>
        set((state) => {
          const txs = state.transactionsByWallet[wallet] || [];
          return {
            transactionsByWallet: {
              ...state.transactionsByWallet,
              [wallet]: txs.map((tx) =>
                tx.hash === hash ? { ...tx, ...updates } : tx
              ),
            },
          };
        }),

      markCourseCompleted: (wallet, courseId) =>
        set((state) => {
          const completed = state.completedCoursesByWallet[wallet] || [];
          return {
            completedCoursesByWallet: {
              ...state.completedCoursesByWallet,
              [wallet]: [...new Set([...completed, courseId])],
            },
          };
        }),

      markLessonRead: (wallet, courseId, lessonIndex) =>
        set((state) => {
          const walletProgress = state.courseProgressByWallet[wallet] || {};
          const existing = walletProgress[courseId] || { lessonsRead: [], quizPassed: false, quizScore: null };
          const lessonsRead = [...new Set([...existing.lessonsRead, lessonIndex])];
          
          return {
            courseProgressByWallet: {
              ...state.courseProgressByWallet,
              [wallet]: {
                ...walletProgress,
                [courseId]: { ...existing, lessonsRead },
              },
            },
          };
        }),

      markQuizPassed: (wallet, courseId, score) =>
        set((state) => {
          const walletProgress = state.courseProgressByWallet[wallet] || {};
          const existing = walletProgress[courseId] || { lessonsRead: [], quizPassed: false, quizScore: null };
          
          return {
            courseProgressByWallet: {
              ...state.courseProgressByWallet,
              [wallet]: {
                ...walletProgress,
                [courseId]: { ...existing, quizPassed: true, quizScore: score },
              },
            },
          };
        }),

      recordWithdrawal: (wallet, amount) =>
        set((state) => {
          const current = state.withdrawnAmountByWallet[wallet] || 0;
          return {
            withdrawnAmountByWallet: {
              ...state.withdrawnAmountByWallet,
              [wallet]: current + amount,
            },
          };
        }),

      getCourseProgress: (wallet, courseId) => {
        if (!wallet) return { lessonsRead: [], quizPassed: false, quizScore: null };
        const state = get();
        const walletProgress = state.courseProgressByWallet[wallet] || {};
        return walletProgress[courseId] || { lessonsRead: [], quizPassed: false, quizScore: null };
      },

      getCompletedCourses: (wallet) => {
        if (!wallet) return [];
        return get().completedCoursesByWallet[wallet] || [];
      },

      getTransactions: (wallet) => {
        if (!wallet) return [];
        return get().transactionsByWallet[wallet] || [];
      },

      getWithdrawnAmount: (wallet) => {
        if (!wallet) return 0;
        return get().withdrawnAmountByWallet[wallet] || 0;
      }
    }),
    {
      name: 'learn-to-earn-storage',
      // only persist user data
      partialize: (state) => ({
        completedCoursesByWallet: state.completedCoursesByWallet,
        transactionsByWallet: state.transactionsByWallet,
        courseProgressByWallet: state.courseProgressByWallet,
        withdrawnAmountByWallet: state.withdrawnAmountByWallet,
      }),
    }
  )
);
