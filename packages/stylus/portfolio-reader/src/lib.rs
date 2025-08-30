//!
//! Stylus Portfolio Reader
//!
//! A smart contract that aggregates multiple ERC-20 token balances in a single call.
//! This contract is designed to reduce RPC calls and provide efficient portfolio reading.
//!
//! The contract provides functionality to:
//! - Read multiple token balances for a single user
//! - Batch read balances for multiple users and tokens
//! - Get total portfolio value information
//!
//! Note: this code is a template-only and has not been audited.
//!

// Allow `cargo stylus export-abi` to generate a main function.
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(not(any(test, feature = "export-abi")), no_std)]

#[macro_use]
extern crate alloc;

use alloc::{string::String, vec::Vec};

/// Import items from the SDK. The prelude contains common traits and macros.
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
};

// Define the ERC-20 interface for making external calls
sol_interface! {
    interface IERC20 {
        function balanceOf(address account) external view returns (uint256);
        function decimals() external view returns (uint8);
        function symbol() external view returns (string);
        function name() external view returns (string);
    }
}

// Define storage for our portfolio reader contract
sol_storage! {
    #[entrypoint]
    pub struct PortfolioReader {
    }
}

/// Declare that `PortfolioReader` is a contract with the following external methods.
#[public]
impl PortfolioReader {
    /// Get the balance of a single token for a user
    /// Returns: (token_address, balance, decimals, symbol)
    pub fn get_token_balance(&self, user: Address, token: Address) -> (Address, U256, u8, String) {
        let token_contract = IERC20::new(token);

        let balance = token_contract.balance_of(self, user).unwrap_or(U256::ZERO);
        let decimals = token_contract.decimals(self).unwrap_or(18);
        let symbol = token_contract
            .symbol(self)
            .unwrap_or_else(|_| "UNKNOWN".into());

        (token, balance, decimals, symbol)
    }

    /// Get balances for multiple tokens for a single user
    /// Returns: Vec<(token_address, balance, decimals, symbol)>
    pub fn get_user_portfolio(
        &self,
        user: Address,
        tokens: Vec<Address>,
    ) -> Vec<(Address, U256, u8, String)> {
        let mut balances = Vec::new();

        for token in tokens {
            let token_data = self.get_token_balance(user, token);
            balances.push(token_data);
        }

        balances
    }

    /// Get only non-zero balances for a user (to filter out tokens they don't hold)
    /// Returns: Vec<(token_address, balance, decimals, symbol)> with balance > 0
    pub fn get_non_zero_balances(
        &self,
        user: Address,
        tokens: Vec<Address>,
    ) -> Vec<(Address, U256, u8, String)> {
        let all_balances = self.get_user_portfolio(user, tokens);
        let mut non_zero_balances = Vec::new();

        for balance in all_balances {
            if balance.1 > U256::ZERO {
                non_zero_balances.push(balance);
            }
        }

        non_zero_balances
    }

    /// Get balances for specific tokens (Arbitrum Sepolia tokens)
    pub fn get_portfolio_balances(&self, user: Address) -> Vec<(Address, U256, u8, String)> {
        let mut tokens = Vec::new();

        // Add the Arbitrum Sepolia tokens
        tokens.push(Address::from([
            0x2d, 0x5a, 0x4f, 0x56, 0x34, 0x04, 0x1f, 0x50, 0x18, 0x0a, 0x25, 0xf2, 0x6b, 0x2a,
            0x83, 0x64, 0x45, 0x2e, 0x31, 0x52,
        ])); // AI16Z

        tokens.push(Address::from([
            0x2c, 0xea, 0xf3, 0xdc, 0x8f, 0x19, 0xfe, 0x2a, 0xdd, 0xb5, 0x46, 0x12, 0x58, 0xa2,
            0xf6, 0xbf, 0x3a, 0xb3, 0x5a, 0x28,
        ])); // tCERO

        tokens.push(Address::from([
            0xe5, 0x91, 0xbf, 0x0a, 0x0c, 0xf9, 0x24, 0xa0, 0x67, 0x4d, 0x77, 0x92, 0xdb, 0x04,
            0x6b, 0x23, 0xce, 0xbf, 0x5f, 0x34,
        ])); // WETH

        self.get_user_portfolio(user, tokens)
    }

    /// Simple function to check if the contract is working
    pub fn get_version(&self) -> U256 {
        U256::from(1) // Version 1.0
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_portfolio_reader() {
        use stylus_sdk::testing::*;
        let vm = TestVM::default();
        let contract = PortfolioReader::from(&vm);

        // Test that the contract version is correct
        assert_eq!(U256::from(1), contract.get_version());
    }
}
