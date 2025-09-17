# LUTAR Token Presale Platform

## Product Positioning
A multi-chain token presale platform that allows users to participate in LUTAR token presale paying on various blockchain networks including BTC, ETH, BSC, SOL, Polygon, TRON, and TON through direct wallet connection and native cryptocurrency payments(native chain currency and USDC/USDT on every chain).

## Visual Design Language
- **Design Style**: Minimalism with Cyberpunk accents
- **Core Features**: Clean interfaces with bold blockchain elements, dark mode focused
- **Color Direction**: Deep space background (#0F1218) with accent colors representing different blockchains (orange for BTC, blue for ETH, yellow for BSC, purple for SOL, etc.)

## Core Features

### Multi-Chain Wallet Connection
- Seamless wallet connection across 7 blockchains:
  - Bitcoin (BTC)
  - Ethereum (ETH)
  - Binance Smart Chain (BSC)
  - Solana (SOL)
  - Polygon (POL)
  - TRON
  - TON (The Open Network)
- Support for popular wallets on each chain (MetaMask, Trust Wallet, Phantom, etc.)
- Wallet address display and quick copy functionality
- Wallet balance display for connected chains

### Token Presale Listing
- Featured presale section
- Detailed token information page
- Presale metrics (soft cap, hard cap, raised amount, participants)
- Countdown timer for active presale
- Token vesting and distribution schedules

### Payment Processing
- Direct payment through connected wallets
- Real-time calculation of token allocation based on payment
- Transaction confirmation and verification system
- Payment history and receipt generation
- Support for native cryptocurrencies of each blockchain and USDC/USDT

### User Dashboard
- Active participations overview
- Portfolio tracking for purchased presale tokens
- Transaction history
- Notification center for presale updates
- Referral system

### Security Features
- Secure wallet connection protocols
- Transaction signing confirmation
- Anti-phishing protection
- Smart contract verification badges
- Project team verification indicators

## Page Structure

### Main Navigation
- Home/Explore
- Active Presale
- My Investments
- Wallet Connection
- Help/Support

### Core Pages
1. **Homepage**
   - Hero section with featured presale
   - Quick blockchain selector
   - Upcoming presale phases
   - Platform statistics

2. **Presale Detail Page**
   - Token branding and description
   - Presale metrics and progress bar
   - Blockchain indicator and requirements
   - Purchase interface
   - Project roadmap and team information
   - Tokenomics visualization

3. **Wallet Connection Interface**
   - Multi-chain wallet options
   - Connection status indicators
   - Network switching functionality
   - Wallet balance overview
   - Address display with identicon

4. **User Investment Dashboard**
   - Active investments cards
   - Token claim interface
   - Investment performance metrics
   - Transaction history
   - Referral statistics

## User Flow
1. User lands on homepage and browses LUTAR Token presale
2. User selects desired blockchain
3. User connects wallet for the corresponding blockchain
4. System verifies wallet connection and displays balance
5. User enters desired investment amount
6. System calculates token allocation and displays summary
7. User confirms transaction through wallet interface
8. System processes transaction and confirms participation
9. Investment appears in user dashboard for tracking

## Technical Considerations
- Blockchain node connections for 7 different networks
- Gas fee estimation and optimization
- Cross-chain asset visibility
- Preconfigured wallet addresses list to rereive payments to(for every supported currency/token)
- Automatic LUTAR Token sending to BSC user address he provided(performed by Thirdweb engine self-hosted instance after webhook receiving)
- Security auditing for payment processing
## Wallet list:
BTC: bc1qarvyg3f4ymcwrp0naftqm6zq05j233s82cpaq2
ETH: 0x047693b22f3f9F246A563872E58056f0C766337b
BNB: 0xb23DdB2b79d9af4e4DCE7C457e48F7912e242e9a
TRX: TZFV48S6UVGYvFmLybPgTAwtqm4pKQX4eQ
SOL: EgJbUJKNn8eUpKLEqXPbogEUiUsYE7J5MWLXcEBWHA29
POL: 0xC8a68Cf65CBf292A0Bc3677af6C932926f2aBAd3
TON: {
    address: EQBNY7a1Gsy1O7TX0OhGBnM8YhpHQ6mAWIjq2glCTuJ1SlxF
    comment, tag or note: 4122895226
}
USDC ERC-20: 0x931EecD3bf8f4ed5359C52016fb8F06D29C6202a
USDC BEP-20: 0x5d882e17B8aeeB0f0e82701DB436C42dE2990a83
USDC POL: 0x131050060158C764331Df2588a172d02406dfF14
USDC SOL: 7cGELFBgYjGjZ9ruo5ckXf4ZomNkgQxoRGjrMPwwKAho

USDT TRC-20: TY8JjNbWDVA6wbTFot8vEL8vMNXFYdsibg
USDT TON: { 
    address: EQBNY7a1Gsy1O7TX0OhGBnM8YhpHQ6mAWIjq2glCTuJ1SlxF
    comment, tag or note: 7749351237
}
USDT POL: 0x3e62F373D69062A0B5b2851b677Ad8ab1F557aF1
USDT ERC-20: 0xBf8A4341Fe649018D3C56f85092233EdC7242f12

