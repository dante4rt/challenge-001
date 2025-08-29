"use client";

import { useState } from "react";
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { BurnerWalletModal } from "./BurnerWalletModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { saveBurnerPK, burnerWalletId } from "~~/utils/scaffold-stylus/burner";
import { liskSepolia } from "~~/utils/scaffold-stylus/supportedChains";
import { useConnect, useConnectors, useAccount, useDisconnect } from "wagmi";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();
  const [isBurnerModalOpen, setIsBurnerModalOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const { address: currentAddress } = useAccount();

  const handleBurnerWalletSelect = async (privateKey: string) => {
    try {
      setIsSwitching(true);
      saveBurnerPK({ privateKey: privateKey as `0x${string}` });

      const burnerConnector = connectors.find(connector => connector.id === burnerWalletId);

      if (burnerConnector) {
        await disconnect();
        await new Promise(resolve => setTimeout(resolve, 100));
        await connect({ connector: burnerConnector });

        setIsBurnerModalOpen(false);
      } else {
        console.error("Burner connector not found. Available connectors:", connectors);
      }
    } catch (error) {
      console.error("Failed to connect to burner wallet:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <>
      <ConnectButton.Custom>
        {({ account, chain, openConnectModal, mounted }) => {
          const connected = mounted && account && chain;

          const handleConnect = () => {
            if (targetNetwork.id === liskSepolia.id) {
              setIsBurnerModalOpen(true);
            } else {
              openConnectModal();
            }
          };

          return (
            <>
              {(() => {
                if (!connected && !isSwitching) {
                  return (
                    <button className="btn bg-secondary btn-sm" onClick={handleConnect} type="button">
                      Connect
                    </button>
                  );
                }

                if (isSwitching) {
                  return (
                    <button className="btn bg-secondary btn-sm" disabled type="button">
                      Switching...
                    </button>
                  );
                }

                if (!account || !chain) {
                  return (
                    <button className="btn bg-secondary btn-sm" disabled type="button">
                      Loading...
                    </button>
                  );
                }

                if (chain.unsupported || chain.id !== targetNetwork.id) {
                  return <WrongNetworkDropdown />;
                }

                return (
                  <>
                    <div className="flex flex-col items-center mr-1">
                      <Balance address={account.address as Address} className="min-h-0 h-auto" />
                      <span className="text-xs" style={{ color: networkColor }}>
                        {chain.name}
                      </span>
                    </div>
                    <AddressInfoDropdown
                      address={account.address as Address}
                      displayName={account.displayName}
                      ensAvatar={account.ensAvatar}
                      onSwitchAccount={() => setIsBurnerModalOpen(true)}
                    />
                    <AddressQRCodeModal address={account.address as Address} modalId="qrcode-modal" />
                  </>
                );
              })()}
            </>
          );
        }}
      </ConnectButton.Custom>

      <BurnerWalletModal
        isOpen={isBurnerModalOpen}
        onClose={() => setIsBurnerModalOpen(false)}
        onSelectAccount={handleBurnerWalletSelect}
        currentAddress={currentAddress}
        isSwitching={isSwitching}
      />
    </>
  );
};
