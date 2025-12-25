# ChainRaise

<div align="center">

**A Decentralized Crowdfunding Platform Built on Stacks Blockchain**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Clarity Version](https://img.shields.io/badge/clarity-3.0-purple.svg)](https://docs.stacks.co/docs/clarity)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)](https://reactjs.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Smart Contract](#smart-contract)
- [Frontend Application](#frontend-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

ChainRaise is a transparent, trustless crowdfunding platform that leverages the power of blockchain technology to revolutionize how campaigns are created, funded, and managed. Built on the Stacks blockchain, ChainRaise enables campaign creators to raise funds using STX and sBTC while providing donors with unprecedented transparency and security.

### Key Differentiators

- **🎯 Milestone-Based Releases**: Funds can be released in stages based on predefined milestones
- **👥 Multi-Beneficiary Support**: Distribute funds to multiple recipients with percentage-based allocation
- **⏰ Time-Based Refunds**: Automatic refunds if campaigns don't meet their goals within the specified timeframe
- **🛡️ Emergency Pause**: Built-in security mechanism to pause campaigns in case of emergencies
- **💎 Dual Currency**: Accept both STX and sBTC donations
- **📊 Complete Transparency**: All transactions and events are recorded on-chain

---

## ✨ Features

### For Campaign Creators

- **Easy Campaign Setup**: Initialize campaigns with customizable goals, duration, and metadata
- **Category-Based Organization**: Organize campaigns by categories (Environment, Education, Health, etc.)
- **Beneficiary Management**: Add up to 10 beneficiaries with precise percentage splits
- **Milestone Tracking**: Set and track campaign milestones with individual withdrawal capabilities
- **Real-Time Analytics**: Monitor donations, progress, and campaign statistics
- **Emergency Controls**: Pause or cancel campaigns if needed

### For Donors

- **Transparent Donations**: All donations are recorded on the blockchain
- **Refund Protection**: Automatic refunds if campaigns fail to meet goals
- **Dual Currency Options**: Donate in STX or sBTC
- **Donation Limits**: Configurable minimum and maximum donation amounts
- **Contribution History**: Track all your contributions across campaigns
- **Favorites System**: Save and track campaigns you're interested in

### Security Features

- **Owner-Only Functions**: Critical operations restricted to campaign owners
- **Single Initialization**: Campaigns can only be initialized once
- **State Validation**: Comprehensive checks throughout the contract lifecycle
- **Withdrawal Authorization**: Multi-level authorization for fund withdrawals
- **Pause Mechanism**: Emergency pause functionality for campaign security

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (React)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Components  │  │    Hooks     │  │  Context  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────┬───────────────────────────────┘
                      │
                      │ Web3 Integration
                      │ (@stacks/connect)
                      │
┌─────────────────────▼───────────────────────────────┐
│             Stacks Blockchain Layer                  │
│  ┌──────────────────────────────────────────────┐  │
│  │     ChainRaise Smart Contract (Clarity)      │  │
│  │  ┌────────┐  ┌──────────┐  ┌──────────────┐ │  │
│  │  │ STX    │  │ sBTC     │  │  Campaign    │ │  │
│  │  │ Logic  │  │ Logic    │  │  Management  │ │  │
│  │  └────────┘  └──────────┘  └──────────────┘ │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Smart Contract

- **Language**: [Clarity](https://clarity-lang.org/) v3.0
- **Blockchain**: [Stacks](https://www.stacks.co/)
- **Development Tool**: [Clarinet](https://github.com/hirosystems/clarinet)
- **Testing**: Vitest with Clarinet SDK

### Frontend

- **Framework**: React 18.3 with TypeScript 5.8
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM 6.30
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Notifications**: Sonner

### Development Tools

- **Package Manager**: npm/Bun
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Testing**: Vitest
- **Version Control**: Git

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Clarinet](https://github.com/hirosystems/clarinet) (for smart contract development)
- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/) (optional, for frontend development)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/chain-raise.git
cd chain-raise
```

2. **Install root dependencies**

```bash
npm install
```

3. **Install frontend dependencies**

```bash
cd frontend
npm install
# or with Bun
bun install
```

### Development

#### Smart Contract Development

1. **Check contract syntax**

```bash
clarinet check
```

2. **Run contract tests**

```bash
npm test
```

3. **Start Clarinet console (interactive REPL)**

```bash
clarinet console
```

4. **Start local devnet (optional)**

```bash
clarinet devnet start
```

#### Frontend Development

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Start development server**

```bash
npm run dev
# or with Bun
bun run dev
```

3. **Open your browser**

Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_NETWORK=devnet
VITE_API_URL=http://localhost:3999
```

---

## 📜 Smart Contract

### Contract Overview

The ChainRaise smart contract (`chain-raise.clar`) provides the core functionality for campaign management and donation handling.

### Key Functions

#### Campaign Management

- `initialize-campaign`: Initialize a new campaign with goal, duration, and metadata
- `cancel-campaign`: Cancel an active campaign (owner only)
- `toggle-pause`: Pause or resume campaign operations
- `get-campaign-info`: Retrieve comprehensive campaign information

#### Beneficiary Management

- `add-beneficiary`: Add a beneficiary with percentage allocation
- `get-beneficiary`: Retrieve beneficiary information
- `is-beneficiary`: Check if an address is a beneficiary

#### Milestone Management

- `add-milestone`: Add a milestone with amount and description
- `withdraw-milestone`: Withdraw funds allocated to a specific milestone
- `get-milestone`: Retrieve milestone details

#### Donations

- `donate-stx`: Donate STX to a campaign
- `donate-sbtc`: Donate sBTC to a campaign
- `get-total-donation`: Get total donations from a specific donor
- `get-refund-amount`: Calculate refundable amount for a donor

#### Configuration

- `set-min-donation`: Set minimum donation amounts (owner only)
- `set-max-donation`: Set maximum donation amounts (owner only)

### Error Codes

| Code | Error | Description |
|------|-------|-------------|
| 100 | `err-not-authorized` | Caller is not authorized for this operation |
| 101 | `err-campaign-ended` | Campaign has already ended |
| 102 | `err-not-initialized` | Campaign has not been initialized |
| 103 | `err-not-cancelled` | Campaign is not in cancelled state |
| 104 | `err-campaign-not-ended` | Campaign has not ended yet |
| 105 | `err-campaign-cancelled` | Campaign has been cancelled |
| 106 | `err-already-initialized` | Campaign has already been initialized |
| 107 | `err-already-withdrawn` | Funds have already been withdrawn |
| 108 | `err-paused` | Campaign is currently paused |
| 109 | `err-donation-too-small` | Donation amount below minimum |
| 110 | `err-donation-too-large` | Donation amount exceeds maximum |
| 111 | `err-milestone-not-found` | Milestone does not exist |
| 112 | `err-milestone-already-withdrawn` | Milestone funds already withdrawn |
| 113 | `err-invalid-percentage` | Invalid percentage value |
| 114 | `err-goal-not-met` | Campaign goal has not been met |
| 115 | `err-beneficiary-exists` | Beneficiary already exists |

### Testing

Run the comprehensive test suite:

```bash
npm test
```

For detailed coverage and cost report:

```bash
npm run test:report
```

Or using Vitest directly with options:

```bash
vitest run -- --coverage --costs
```

Watch mode for continuous testing:

```bash
npm run test:watch
```

---

## 💻 Frontend Application

### Key Pages

#### 1. **Home/Index** (`/`)
- Landing page with platform overview
- Featured campaigns carousel
- Call-to-action sections

#### 2. **Explore** (`/explore`)
- Browse all active campaigns
- Filter by category
- Search functionality
- Campaign cards with progress indicators
- Skeleton loaders for optimal UX

#### 3. **Campaign Detail** (`/campaign/:id`)
- Detailed campaign information
- Real-time progress tracking
- Donation interface
- Milestone visualization
- Creator information
- Donation history

#### 4. **Create Campaign** (`/create`)
- Multi-step campaign creation wizard
- Form validation with React Hook Form and Zod
- Image upload functionality
- Beneficiary management
- Milestone configuration

#### 5. **Dashboard** (`/dashboard`)
- Campaign creator dashboard
- Performance analytics
- Charts and statistics
- Quick actions panel
- Goal progress tracking

### Key Components

```
components/
├── campaigns/
│   ├── CampaignCard           # Campaign preview card
│   ├── CampaignCardSkeleton   # Loading state
│   ├── CampaignManageDialog   # Campaign management
│   └── ImageUploader          # Image upload component
├── dashboard/
│   ├── DashboardCharts        # Analytics visualizations
│   ├── EnhancedStatCard       # Stat display cards
│   └── QuickActions           # Quick action buttons
├── donations/
│   └── RefundRequestDialog    # Refund request interface
├── layout/
│   ├── Header                 # Navigation header
│   └── Footer                 # Page footer
├── skeletons/
│   └── *                      # Loading skeletons
└── ui/
    └── *                      # Reusable UI primitives
```

### State Management

- **Context API**: Favorites management
- **TanStack Query**: Server state and cache management
- **React Hook Form**: Form state
- **Local Storage**: Persistent user preferences

### Custom Hooks

- `useFavorites`: Manage favorite campaigns
- `usePagination`: Handle pagination logic
- `useScrollReveal`: Scroll-triggered animations
- `useMobile`: Responsive breakpoint detection
- `useToast`: Toast notification system

---

## 🧪 Testing

### Smart Contract Tests

Located in `tests/chain-raise.test.ts`, covering:

- Campaign initialization and lifecycle
- Donation functionality (STX and sBTC)
- Beneficiary management
- Milestone tracking
- Refund mechanisms
- Access control
- Edge cases and error conditions

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:report

# Watch mode
npm run test:watch

# Frontend tests
cd frontend
npm run lint
```

---

## 📦 Deployment

### Smart Contract Deployment

1. **Configure deployment settings**

Edit `settings/Testnet.toml` with your deployment account:

```toml
[network]
name = "testnet"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "<YOUR TESTNET MNEMONIC>"
balance = 100_000_000_000_000
derivation = "m/44'/5757'/0'/0/0"
```

2. **Get testnet STX from the faucet**

Visit the [Hiro Platform faucet](https://platform.hiro.so/faucet) or [testnet faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)

3. **Validate contracts**

```bash
clarinet check
```

4. **Generate deployment plan**

```bash
clarinet deployments generate --testnet --medium-cost
```

5. **Deploy to testnet**

```bash
clarinet deployments apply --testnet
```

6. **Deploy to mainnet**

Configure `settings/Mainnet.toml` and run:

```bash
clarinet deployments generate --mainnet --medium-cost
clarinet deployments apply --mainnet
```

### Frontend Deployment

1. **Build for production**

```bash
cd frontend
npm run build
```

2. **Preview production build**

```bash
npm run preview
```

3. **Deploy to hosting platform**

The build output in `frontend/dist` can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

#### Environment Variables for Production

```env
VITE_NETWORK=mainnet
VITE_API_URL=https://api.mainnet.hiro.so
VITE_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
VITE_CONTRACT_NAME=chain-raise
```

---

## 📁 Project Structure

```
chain-raise/
├── contracts/
│   └── chain-raise.clar          # Main smart contract
├── deployments/
│   └── default.simnet-plan.yaml  # Deployment configuration
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── contexts/             # React contexts
│   │   ├── hooks/                # Custom hooks
│   │   ├── lib/                  # Utilities and helpers
│   │   ├── pages/                # Page components
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx              # Entry point
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json             # TypeScript config
│   ├── vite.config.ts            # Vite configuration
│   └── tailwind.config.ts        # Tailwind configuration
├── settings/
│   ├── Devnet.toml               # Devnet settings
│   ├── Testnet.toml              # Testnet settings
│   └── Mainnet.toml              # Mainnet settings
├── tests/
│   └── chain-raise.test.ts       # Smart contract tests
├── Clarinet.toml                 # Clarinet project config
├── FRONTEND_PRD.md               # Frontend requirements doc
├── package.json                  # Root dependencies
├── tsconfig.json                 # Root TypeScript config
├── vitest.config.js              # Test configuration
└── README.md                     # This file
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**: Open an issue describing the bug and how to reproduce it
2. **Suggest Features**: Share your ideas for new features or improvements
3. **Submit Pull Requests**: Fix bugs, add features, or improve documentation
4. **Improve Documentation**: Help us make our docs clearer and more comprehensive
5. **Write Tests**: Increase test coverage for both smart contracts and frontend

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Write clear comments for complex logic
- Maintain consistent formatting (use ESLint)
- Write tests for new functionality

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Stacks Foundation](https://stacks.org/) for the blockchain platform
- [Hiro Systems](https://www.hiro.so/) for Clarinet and developer tools
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- The open-source community for inspiration and support

---

## 📞 Support

- **Documentation**: [Full documentation](https://docs.yourproject.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/chain-raise/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/chain-raise/discussions)
- **Twitter**: [@YourProject](https://twitter.com/yourproject)
- **Discord**: [Join our community](https://discord.gg/yourserver)

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] Smart contract development
- [x] Basic frontend interface
- [x] Campaign creation and management
- [x] STX and sBTC donations
- [x] Milestone tracking

### Phase 2: Enhanced Features 🚧
- [ ] Social sharing integration
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Mobile app development
- [ ] Multi-language support

### Phase 3: Ecosystem Expansion 📋
- [ ] Third-party integrations
- [ ] API for external platforms
- [ ] Campaign templates
- [ ] Verification system for creators
- [ ] Governance token implementation
