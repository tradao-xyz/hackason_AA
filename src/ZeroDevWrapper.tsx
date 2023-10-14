import React from "react";
import {
  WagmiConfig,
  configureChains,
  createConfig,
} from "wagmi";
import { publicProvider } from 'wagmi/providers/public';
import { arbitrum } from 'wagmi/chains'
import { connectorsForWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import {
  googleWallet,
  facebookWallet,
  githubWallet,
  discordWallet,
  twitchWallet,
  twitterWallet,
} from '@zerodev/wagmi/rainbowkit'

export const projectId = '0864346d-c650-4383-830b-35bdfd2fa5be'

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrum],
  [publicProvider()]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Social',
    wallets: [
      googleWallet({ chains, options: { projectId } }),
      facebookWallet({ chains, options: { projectId } }),
      githubWallet({ chains, options: { projectId } }),
      discordWallet({ chains, options: { projectId } }),
      twitchWallet({ chains, options: { projectId } }),
      twitterWallet({ chains, options: { projectId } }),
    ],
  },
]);

const config = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient
})

function ZeroDevWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider theme={darkTheme()} chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default ZeroDevWrapper