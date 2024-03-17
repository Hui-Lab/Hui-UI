import { useState } from "react";
import "./Vault.scss";
import { config } from "../../../wagmiConfig";
import { writeContract, readContract } from "@wagmi/core";
import { parseUnits } from "viem";
import VaultABI from "../../json/ABI/Vault.json";

const pseudoHUI = [
	{
		address: "0x487C79d64484de826eE2405A02a1b8ffC96693B7",
		HUIInVault: 100,
		totalFee: 10,
		currentReward: 5,
		AlreadyPaid: 5,
		timeTillNextPay: "1 day"
	},
	{
		address: "0x487C79d64484de826eE2405A02a1b8ffC96693B7",
		HUIInVault: 200,
		totalFee: 20,
		currentReward: 10,
		AlreadyPaid: 0,
		timeTillNextPay: "N/A"
	},
	{
		address: "0x487C79d64484de826eE2405A02a1b8ffC96693B7",
		HUIInVault: 300,
		totalFee: 30,
		currentReward: 15,
		AlreadyPaid: 10,
		timeTillNextPay: "1 hour"
	},
	{
		address: "0x487C79d64484de826eE2405A02a1b8ffC96693B7",
		HUIInVault: 400,
		totalFee: 40,
		currentReward: 20,
		AlreadyPaid: 0,
		timeTillNextPay: "N/A"
	},
	{
		address: "0x487C79d64484de826eE2405A02a1b8ffC96693B7",
		HUIInVault: 500,
		totalFee: 50,
		currentReward: 25,
		AlreadyPaid: 50,
		timeTillNextPay: "1 minute"
	}
];

//address
//HUIInVault
//totalFee
//currentReward

export default function Vault() {
	const HUIList = pseudoHUI;

	const getVaultAction = (index) => {
		return HUIList[index].AlreadyPaid === 0 ? "Entry" :
			HUIList[index].AlreadyPaid === HUIList[index].totalFee ? "Withdraw" : "Pay Fee";
	}

	const handleEntryVault = async (VaultAddress, period, amountPerPeriod) => {
		try {
			const EntryResult = await writeContract(config, {
				abi: VaultABI,
				address: VaultAddress,
				functionName: "entryVault",
				args: [period, parseUnits(amountPerPeriod, 18)]
			});
			console.log(EntryResult);
		}
		catch (error) {
			console.log(error);
		}
	}

	const handleWithdrawVault = async (VaultAddress) => {
		try {
			const WithdrawResult = await writeContract(config, {
				abi: VaultABI,
				address: VaultAddress,
				functionName: "withdrawWithReward",
				args: []
			});
			console.log(WithdrawResult);
		}
		catch (error) {
			console.log(error);
		}
	}



	const handlePayFee = async (VaultAddress, payAmount) => {
		try {
			const PayResult = await writeContract(config, {
				abi: VaultABI,
				address: VaultAddress,
				functionName: "pay",
				args: [parseUnits(payAmount, 18)]
			});
			console.log(PayResult);
		}
		catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="Vault">
			<div className="Title">
				HUI Vaults
			</div>
			<div className="VaultGrid">
				{HUIList.map((VaultItem, index) => {
					console.log(VaultItem);
					return (
						<div key={index} className="HUI">
							<div className="HUIInfo">
								<span>Address:</span>
								<span>{VaultItem.address?.slice(0, 4) + "..." + VaultItem.address?.slice(38)}</span>
							</div>
							<div className="HUIInfo">
								<span>HUI in Vault:</span>
								<span>
									{VaultItem.HUIInVault}
								</span>
							</div>
							<div className="HUIInfo">
								<span>Total Fee:</span>
								<span>
									{VaultItem.totalFee}
								</span>
							</div>
							<div className="HUIInfo">
								<span>Current Reward:</span>
								<span>
									{VaultItem.currentReward}
								</span>
							</div>
							<div className="HUIInfo">
								<span>Already Paid:</span>
								<span>
									{VaultItem.AlreadyPaid}
								</span>
							</div>
							<div className="HUIInfo">
								<span>Time Till Next Pay:</span>
								<span>
									{VaultItem.timeTillNextPay}
								</span>
							</div>
							{getVaultAction(index) === "Entry" && (
								<div className="EntryInput">
									<input type="text" placeholder="Period" />
									<input type="text" placeholder="Amount per period" />
								</div>
							)}

							{getVaultAction(index) === "Pay Fee" && (
								<div className="PayFeeInput">
									<input type="text" placeholder="Pay Amount" />
								</div>
							)}

							<div
								onClick={() => {
									const action = getVaultAction(index);
									switch (action) {
										case "Entry":
											handleEntryVault(VaultItem.address);
											break;
										case "Withdraw":
											handleWithdrawVault(VaultItem.address);
											break;
										case "Pay Fee":
											handlePayFee(VaultItem.address);
											break;
										default:
											break;
									}
								}}
								className="HUIButton">
								{getVaultAction(index)}
							</div>
						</div>
					)
				})}
			</div>

		</div>
	);
}
