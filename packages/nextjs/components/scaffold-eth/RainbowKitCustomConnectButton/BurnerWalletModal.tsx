import { useRef, useState } from "react";
import { BlockieAvatar } from "..";
import { useTheme } from "next-themes";
import { useOutsideClick } from "~~/hooks/scaffold-eth/useOutsideClick";
import { liskSepolia } from "~~/utils/scaffold-stylus/supportedChains";

interface BurnerWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (privateKey: string) => void;
  currentAddress?: string;
  isSwitching?: boolean;
}

export const BurnerWalletModal = ({
  isOpen,
  onClose,
  onSelectAccount,
  currentAddress,
  isSwitching,
}: BurnerWalletModalProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  useOutsideClick(modalRef, onClose);

  if (!isOpen) return null;

  const handleAccountSelect = (privateKey: string, address: string) => {
    setSelectedAccount(address);

    if (currentAddress?.toLowerCase() === address.toLowerCase()) {
      onClose();
      return;
    }

    onSelectAccount(privateKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`rounded-2xl p-6 max-w-md w-full mx-4 ${isDarkMode ? "bg-[#272727]" : "gradient-border-light"}`}
      >
        <div className="flex justify-center items-center mb-4 w-full">
          <h3 className="text-lg font-semibold text-center">
            {isSwitching ? "Switching Account..." : "Choose account"}
          </h3>
        </div>

        <div className="space-y-2">
          {liskSepolia.accounts.map(account => {
            const isCurrentAccount = currentAddress?.toLowerCase() === account.address.toLowerCase();
            const isSelected = account.address === selectedAccount;

            return (
              <button
                key={account.address}
                onClick={() => handleAccountSelect(account.privateKey, account.address)}
                disabled={isSwitching}
                className={`w-full p-3 text-left rounded-lg border ${
                  isCurrentAccount
                    ? "border-green-500 bg-green-500/10"
                    : isDarkMode
                      ? "border-black hover:bg-black"
                      : "gradient-border-light-hover hover:text-white"
                } ${isSwitching ? "opacity-50 cursor-not-allowed" : ""} transition-colors`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-[30px] items-center">
                    <BlockieAvatar address={account.address} size={28} />
                    <div className="text-sm font-medium">
                      {account.address.slice(0, 6)}...{account.address.slice(-4)}
                      {isCurrentAccount && <span className="ml-2 text-xs text-green-500 font-bold">(Current)</span>}
                    </div>
                  </div>
                  <div className="text-xs text-base-content/50">{isSelected ? "✓" : isCurrentAccount ? "●" : ""}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
