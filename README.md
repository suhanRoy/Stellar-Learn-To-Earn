<div align="center">
  
# 🎓 Stellar Learn-To-Earn

**A decentralized Web3 educational platform built on the Stellar network using Soroban.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Network-Stellar_Testnet-black)](https://stellar.org/)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange)](https://soroban.stellar.org/)

![Hero Dashboard](./demo-img/hero-desktop.png)

*An immersive and highly-gamified educational experience where users learn about the Stellar ecosystem, pass quizzes, and earn on-chain rewards.*

</div>

---

## 📌 Submission Details & Quick Links

*   **🌐 Live Production Link**: [Insert Live Link Here]
*   **📹 Demo Video Presentation**: [Insert Video Link Here]
*   **💻 GitHub Repository**: [Insert GitHub Repo Link Here]

---

## 📖 The Vision: Problem & Solution

### The Problem
Onboarding new developers and users into Web3 ecosystems is notoriously difficult. Traditional documentation is dry and theoretical, lacking the hands-on engagement needed for true understanding. Furthermore, users invest time learning without any tangible, immediate incentives, leading to high drop-off rates before they ever make an on-chain transaction.

### The Solution: Stellar Learn-To-Earn
We solve this by introducing a decentralized, high-stakes gamified learning environment:
- **Read & Pass to Earn**: Users read curriculum modules and take quizzes. Passing a quiz instantly unlocks LRN (Learn) token rewards.
- **On-Chain Payouts**: Rewards are minted and deposited directly to the user's Freighter wallet via Soroban smart contracts.
- **1:1 XLM Conversion**: Users can visit their Dashboard to withdraw and convert their earned LRN tokens into real Testnet XLM.
- **Live Activity Feed**: Global real-time events are tracked on the Stellar Testnet, showcasing a live feed of new courses and reward claims.
- **Premium Aesthetics**: Clean monochromatic layouts, sleek Framer Motion micro-animations, and dynamic mobile-responsive styling create a premium Web2-quality experience.

---

## 🏆 Orange Belt Requirements Mapping

| Requirement | Implementation |
|-------------|----------------|
| **Advanced Soroban Smart Contracts** | Implemented custom persistent storage for Course states, user progress tracking, and secure Reward Token minting logic. |
| **Inter-contract communication** | The `course-manager` contract actively makes cross-contract calls to the `reward-token` contract to mint LRN upon successful quiz completion. |
| **Real-time events** | The `ActivityFeed` component polls the Soroban RPC for live `COURSE_CREATED` and `REWARD_CLAIMED` events, decoding XDR on the fly for the global UI. |
| **Production transaction UI** | Fully optimistic UI in the dashboard and course pages. Handles simulating, submitting, and polling the RPC until the ledger confirms the transaction block. Highly responsive on mobile and desktop. |
| **StellarWalletsKit integration** | Implemented persistent multi-wallet (Freighter) connectivity using a global Zustand store. |
| **Feature-based architecture** | Strictly separated Next.js App Router components, pages, `WalletProvider` state, and `soroban.ts` data-fetching layers. |

---

## 📸 Interface Showcase

### Desktop Experience

<details open>
<summary><b>Landing Page</b></summary>
<br>

![Desktop Landing](./demo-img/hero-desktop.png)
</details>

<details open>
<summary><b>Personalized Dashboard & Treasury</b></summary>
<br>

![Desktop Dashboard](./demo-img/personlaised-dashbaord.png)
</details>

<details open>
<summary><b>Interactive Courses</b></summary>
<br>

![Courses](./demo-img/courses.png)
</details>

<details open>
<summary><b>Winning Animation & Rewards</b></summary>
<br>

![Winning Animation](./demo-img/winning-animation.png)
</details>

<details open>
<summary><b>Global Network Activity</b></summary>
<br>

![Activity Feed](./demo-img/stellar-network-verfication.png)
</details>

### Mobile Responsiveness
*The entire application is completely mobile responsive, ensuring learners can complete courses and claim rewards from any device seamlessly.*

<div style="display: flex; gap: 10px;">
  <img src="./demo-img/mobile-1.png" alt="Mobile Dashboard" width="48%">
  <img src="./demo-img/mobile-2.png" alt="Mobile Courses" width="48%">
</div>

---

## 🛡️ Smart Contract Architecture & Details

### Deployed Contracts & Credentials
*   **Course Manager Contract ID**: `CAMD6YJOODWV7LN3IE44ILF4JMBH7BZKT7VHWHF6Z56GWFSGRNG645QT`
*   **Reward Token Contract ID**: `CBHVOYICX2KCRYLQ425PQCWVCUKATZI6MLDUV4CMJQVRVPPTA6U6NRWN`
*   **Stellar Network**: Testnet
*   **Example Transaction Hash**: `[Insert Real Transaction Hash Here]`
*   **Testnet Explorer Link (Course Manager)**: `[Insert Stellar Expert Link Here]`
*   **Testnet Explorer Link (Reward Token)**: `[Insert Stellar Expert Link Here]`
*   **Testnet Explorer Link (Tx Hash)**: `[Insert Stellar Expert Link Here]`

### Smart Contract Flow
```mermaid
sequenceDiagram
    participant Learner
    participant CourseManager
    participant RewardToken
    
    Learner->>CourseManager: submit_quiz(course_id, answers)
    CourseManager->>CourseManager: Validate answers against on-chain hash
    CourseManager->>RewardToken: mint(learner_address, reward_amount)
    RewardToken-->>CourseManager: Mint Successful
    CourseManager-->>Learner: Reward Claimed Event Emitted
    
    Learner->>CourseManager: withdraw_xlm(amount)
    CourseManager->>RewardToken: burn(learner_address, amount)
    CourseManager-->>Learner: Transfer XLM to Learner Wallet
```

---

## 🛠️ Technology Stack
*   **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
*   **Styling & UI**: Tailwind CSS v4 + Framer Motion + Lucide Icons
*   **State Management**: Zustand
*   **Stellar Integration**: `@stellar/stellar-sdk`, `@creit.tech/stellar-wallets-kit`
*   **Contracts**: Rust (Soroban SDK)

---

## 💻 Local Installation & Getting Started

### 📋 Prerequisites
*   Node.js 18+ or 20+
*   Cargo + Rust Toolchain (with `wasm32-unknown-unknown` target)
*   Soroban CLI
*   Freighter Wallet extension installed

### 🛠️ Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone [Insert GitHub Repo Link Here]
   cd Stellar-Learn-To-Earn
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the `frontend` root with your deployed contract IDs:
   ```env
   NEXT_PUBLIC_COURSE_MANAGER_ID=CAMD6YJOODWV7LN3IE44ILF4JMBH7BZKT7VHWHF6Z56GWFSGRNG645QT
   NEXT_PUBLIC_REWARD_TOKEN_ID=CBHVOYICX2KCRYLQ425PQCWVCUKATZI6MLDUV4CMJQVRVPPTA6U6NRWN
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Deploy the Smart Contracts (Optional)**:
   Navigate to the `contracts` directory to build and deploy your Rust contracts to the Stellar Testnet using the Soroban CLI.
   ```bash
   cd contracts
   stellar contract build
   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/course_manager.wasm --source YOUR_IDENTITY --network testnet
   ```

---

<div align="center">
  <b>Developed with ⚔️ by Suhan Roy</b><br>
  <a href="https://github.com/suhanRoy">GitHub Profile</a>
</div>
