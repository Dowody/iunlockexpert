import { mainnet, arbitrum, sepolia } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_PROJECT_ID || "acf46e0cc4d322acb6d86bb030902765" // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Create a metadata object - optional
export const metadata = {
  name: 'AppKit',
  description: 'AppKit',
  url: 'https://dowody.github.io/iunlockexpert/', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [mainnet, arbitrum, sepolia] as [AppKitNetwork, ...AppKitNetwork[]]

// Set up Solana Adapter
export const ethersAdapter = new EthersAdapter();