# Game Tournament Management Blockchain System

![Project Logo](public/assets/images/logo/logo.png)

## Overview

The **Game Tournament Management Blockchain System** is a decentralized platform designed to facilitate the creation, management, and participation in gaming tournaments. By leveraging blockchain technology, this system ensures transparency, fairness, and secure transactions for all participants, including organizers, players, and administrators. Built with a modern tech stack, it combines a Next.js frontend with Ethereum smart contracts to deliver a seamless and trustless gaming experience.

## Key Features

- **Tournament Creation:** Organizers can create tournaments with customizable settings such as game type, entry fees, prize pools, and rules.
- **Player Participation:** Players can browse and join tournaments, submit match results, and claim prizes securely.
- **Blockchain Integration:** Smart contracts ensure transparent and tamper-proof management of tournament data and transactions.
- **Wallet Integration:** Supports cryptocurrency wallets (e.g., MetaMask) for seamless and secure payments using Ethereum.
- **Admin Controls:** Administrators can manage users, resolve disputes, and maintain platform integrity.
- **Real-time Updates:** Convex powers efficient data management and real-time updates across the platform.

## Technology Stack

### Frontend
- **Next.js**: Framework for server-side rendering and static site generation.
- **React**: UI library for building interactive components.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Clerk**: Authentication and user management.
- **Radix UI**: Accessible and customizable UI primitives.
- **Lucide Icons**: Lightweight icon library.

### Backend
- **Convex**: Serverless backend for real-time data management and queries.

### Blockchain
- **Ethereum**: Blockchain network for smart contract execution.
- **Ethers.js**: Library for interacting with Ethereum.
- **Wagmi**: React hooks for Ethereum wallet and blockchain interactions.
- **Solidity**: Language for writing smart contracts.
- **Hardhat**: Development environment for compiling, testing, and deploying contracts.

### Tools
- **TypeScript**: Static typing for enhanced code reliability.
- **ESLint**: Code linting for consistency and quality.
- **Stripe**: Payment processing integration (optional for fiat payments).

## Project Structure

```
.
├── app/                    # Next.js frontend source code
│   ├── (auth)/             # Authentication pages (sign-in, sign-up)
│   ├── components/         # Reusable UI components and modals
│   ├── convex/             # Convex backend configuration and schemas
│   ├── dashboard/          # User dashboard for managing tournaments
│   ├── create-tournament/  # Tournament creation page
│   ├── join-tournament/    # Tournament joining page
│   ├── view-tournaments/   # Tournament browsing and details
│   └── ...                 # Other pages and utilities
├── smart-contract/         # Blockchain smart contract source code
│   ├── contracts/          # Solidity files (Lock.sol, Tournament.sol)
│   ├── ignition/           # Hardhat Ignition deployment modules
│   ├── test/               # Smart contract tests
│   └── typechain-types/    # Generated TypeScript bindings
├── public/                 # Static assets (images, icons)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── types/                  # TypeScript type definitions
└── package.json            # Project dependencies and scripts
```

For a detailed breakdown, refer to the full `tree` output provided in the repository.

## Setup and Installation

### Prerequisites

- **Node.js**: Version 18 or later
- **Yarn**: Package manager
- **MetaMask**: Ethereum wallet browser extension
- **Convex Account**: For backend services (sign up at [convex.dev](https://www.convex.dev))
- **Ethereum Node**: Access to a local or testnet node (e.g., Hardhat, Infura)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/game-tournament-management-blockchain-system.git
   cd game-tournament-management-blockchain-system
   ```

2. **Install Root Dependencies**
   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   CONVEX_DEPLOYMENT=your_convex_deployment
   ```

4. **Run the Frontend Development Server**
   ```bash
   yarn dev
   ```
   The app will be available at `http://localhost:3000`.

5. **Set Up Smart Contracts**
   - Navigate to the smart contract directory:
     ```bash
     cd smart-contract
     ```
   - Install dependencies:
     ```bash
     yarn install
     ```
   - Compile the contracts:
     ```bash
     yarn hardhat compile
     ```
   - Deploy to a network (e.g., local Hardhat node):
     ```bash
     yarn hardhat ignition deploy ./ignition/modules/Lock.ts --network localhost
     ```
     - Start a local Hardhat node in a separate terminal if needed:
       ```bash
       yarn hardhat node
       ```
   - Update the frontend’s `config/web3-config.ts` with the deployed contract addresses.

## Usage

1. **Sign Up / Sign In**
   - Visit `/sign-up` or `/sign-in` to create an account or log in using Clerk authentication.

2. **Become a Member or Admin**
   - Navigate to `/become-a-member` or `/become-an-admin` to apply for roles.

3. **Create a Tournament**
   - Go to `/create-tournament`, connect your wallet, and configure tournament details.

4. **Join a Tournament**
   - Browse tournaments at `/join-tournament`, select one, and pay the entry fee via your wallet.

5. **Submit Match Results**
   - After a match, use the "Submit Match Results" modal to report outcomes.

6. **Claim Prizes**
   - Winners can claim prizes via the "Claim Prize" modal, with funds sent to their wallet.

7. **Admin Functions**
   - Admins can access `/dashboard` to manage users, review disputes, and monitor tournaments.

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request on GitHub.

Please ensure your code adheres to the project’s ESLint rules and includes appropriate tests for smart contract changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README provides a comprehensive guide to understanding, setting up, and using the Game Tournament Management Blockchain System. For additional support, feel free to open an issue on the repository!
