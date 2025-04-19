import Web3 from 'web3';
import { provider } from 'web3-core';

interface WalletResponse {
  provider: provider;
  address: string;
}

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

const isIOS = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const usdtContractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // Mainnet USDT contract

const usdtAbi = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
];

export const connectTrustWallet = async (): Promise<WalletResponse> => {
  try {
    if (isMobile()) {
      const dappUrl = window.location.href;
      const redirectUrl = encodeURIComponent(dappUrl);
      
      let deepLink = `trust://`;
      
      if (isAndroid() || isIOS()) {
        window.location.href = deepLink;
        
        // Fallback to store if Trust Wallet is not installed
        setTimeout(() => {
          if (isAndroid()) {
            window.location.href = 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp';
          } else {
            window.location.href = 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409';
          }
        }, 2500);
      }

      return new Promise((resolve) => {
        const handleVisibilityChange = () => {
          if (!document.hidden) {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            resolve({
              provider: window.ethereum || null,
              address: ''
            });
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
      });
    }

    if (!window.ethereum) {
      throw new Error('Please install Trust Wallet extension to continue');
    }

    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your wallet.');
    }

    return {
      provider: window.ethereum,
      address: accounts[0]
    };
  } catch (error) {
    console.error('Trust Wallet connection error:', error);
    throw error;
  }
};

export const sendTransaction = async (
  provider: provider,
  toAddress: string,
  amount: string
): Promise<{ hash: string }> => {
  try {
    if (isMobile()) {
      // Format amount to 2 decimal places
      const formattedAmount = parseFloat(amount).toFixed(2);
      
      // Construct deep link for USDT transfer
      const deepLink = `trust://send_usdt?address=${toAddress}&amount=${formattedAmount}`;
      
      // Open Trust Wallet
      window.location.href = deepLink;

      return new Promise((resolve) => {
        const handleVisibilityChange = () => {
          if (!document.hidden) {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            resolve({
              hash: `mobile-tx-${Date.now()}`
            });
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
      });
    }

    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your wallet.');
    }

    const fromAddress = accounts[0];
    const contract = new web3.eth.Contract(usdtAbi, usdtContractAddress);

    const usdtAmount = (parseFloat(amount) * 1_000_000).toString(); // USDT uses 6 decimals

    const tx = await contract.methods.transfer(toAddress, usdtAmount).send({
      from: fromAddress
    });

    return {
      hash: tx.transactionHash
    };
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
};

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}