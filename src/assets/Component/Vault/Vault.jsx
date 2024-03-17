import { useContext, useEffect, useState } from "react";
import "./Vault.scss";
import { config } from "../../../wagmiConfig";
import { writeContract, readContract } from "@wagmi/core";
import { erc20Abi, parseUnits } from "viem";
import VaultABI from "../../json/ABI/Vault.json";
import { ChainContext } from "../../../Context/ChainContext";
import LineaTokenList from "../../json/LineaTokenList.json";
import PolygonZKEVMTokenList from "../../json/PolygonZKEVMTokenList.json";
import { useAccount } from "wagmi";
import { getBalance } from "@wagmi/core";

const pseudoHUI = [
	{
		address: "0xb645Ee358d0bD28184e37756c83020493E838ca6",
	},
];

//address
//HUIInVault
//totalFee
//currentReward

export default function Vault() {
	const { address } = useAccount();
	const activeChain = useContext(ChainContext);
	const HUIList = pseudoHUI;
	const [doneFetchVault, setDoneFetchVault] = useState(false);

	const getVaultAction = async (index) => {
		const isUserEntry = await readContract(config, {
			abi: VaultABI,
			address: HUIList[index].address,
			functionName: "isUserEntry",
			args: [address],
		});
		if (isUserEntry) return "Entry";
		else {
			if (HUIList[index].AlreadyPaid - HUIList[index].totalFee >= 0)
				return "Withdraw";
			else return "Pay Fee";
		}

		// return HUIList[index].AlreadyPaid === 0
		// 	? "Entry"
		// 	: HUIList[index].AlreadyPaid === HUIList[index].totalFee
		// 		? "Withdraw"
		// 		: "Pay Fee";
	};

	const getHUIAddress = () => {
		return LineaTokenList[4].address;
		if (activeChain.chainID === 59140) return LineaTokenList[4].address;
		if (activeChain.chainID === 1442) return PolygonZKEVMTokenList[4].address;
	};

	useEffect(() => {
		const fetchVault = async () => {
			for (let i = 0; i < HUIList.length; i++) {
				const HUIItem = HUIList[i];
				try {
					const HUIInVault = await getBalance(config, {
						address: HUIItem.address,
						token: getHUIAddress(),
						chainId: activeChain.chainID,
					});
					const totalFee = await readContract(config, {
						abi: VaultABI,
						address: HUIItem.address,
						functionName: "finalBalance",
						args: [],
					});

					const currentReward = await readContract(config, {
						abi: VaultABI,
						address: HUIItem.address,
						functionName: "getCurrentReward",
						args: [],
					});

					const AlreadyPaid = await readContract(config, {
						abi: VaultABI,
						address: HUIItem.address,
						functionName: "getBalance",
						args: [address],
					});

					const timeTillNextPay = await readContract(config, {
						abi: VaultABI,
						address: HUIItem.address,
						functionName: "getNextPaymentTime",
						args: [address],
					});
					HUIList[i] = {
						...HUIItem,
						HUIInVault: HUIInVault.formatted,
						totalFee: totalFee.toString(),
						currentReward: currentReward.toString(),
						AlreadyPaid: AlreadyPaid.toString(),
						timeTillNextPay: timeTillNextPay.toString(),
					};
					const vaultAction = await getVaultAction(i);
					HUIList[i] = {
						...HUIItem,
						HUIInVault: HUIInVault.formatted,
						totalFee: totalFee.toString(),
						currentReward: currentReward.toString(),
						AlreadyPaid: AlreadyPaid.toString(),
						timeTillNextPay: timeTillNextPay.toString(),
						vaultAction: vaultAction,
					};
				} catch (error) {
					console.log(error);
				}
			}
			setDoneFetchVault(true);
		};
		fetchVault();

		return () => {
			setDoneFetchVault(false);
		};
	}, []);

	const handleEntryVault = async (VaultAddress, period, amountPerPeriod) => {
		try {
			console.log(period);
			console.log(parseUnits(amountPerPeriod, 18));
			console.log(address);
			console.log(VaultAddress);
			const huiAddress = getHUIAddress();
			console.log(huiAddress);
			const allowance = await readContract(config, {
				abi: erc20Abi,
				address: getHUIAddress(),
				functionName: "allowance",
				args: [address, VaultAddress],
			});
			if (allowance.toString() < parseUnits(amountPerPeriod, 18)) {
				const approveResult = await writeContract(config, {
					abi: erc20Abi,
					address: getHUIAddress(),
					functionName: "approve",
					args: [VaultAddress, parseUnits(amountPerPeriod, 18)],
				});
			}
			const EntryResult = await writeContract(config, {
				abi: VaultABI,
				address: VaultAddress,
				functionName: "entryVault",
				args: [
					parseUnits(String(period * 86400), 0),
					parseUnits(amountPerPeriod, 18),
				],
			});
			console.log(EntryResult);
		} catch (error) {
			console.log(error);
		}
	};

	const handleWithdrawVault = async (VaultAddress) => {
		try {
			const WithdrawResult = await writeContract(config, {
				abi: VaultABI,
				address: VaultAddress,
				functionName: "getRewardAndWithdraw",
				args: [],
			});
			console.log(WithdrawResult);
		} catch (error) {
			console.log(error);
		}
	};

	const handlePayFee = async (VaultAddress, payAmount) => {
		try {
			const PayResult = await writeContract(config, {
				abi: VaultABI,
				address: VaultAddress,
				functionName: "pay",
				args: [parseUnits(payAmount, 18)],
			});
			console.log(PayResult);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="Vault">
			<div className="Title">HUI Vaults</div>
			<div className="VaultGrid">
				{doneFetchVault &&
					HUIList.map((VaultItem, index) => {
						console.log(VaultItem);
						return (
							<div key={index} className="HUI">
								<div className="HUIInfo">
									<span>Address:</span>
									<span>
										{VaultItem.address?.slice(0, 4) +
											"..." +
											VaultItem.address?.slice(38)}
									</span>
								</div>
								<div className="HUIInfo">
									<span>HUI in Vault:</span>
									<span>{VaultItem.HUIInVault}</span>
								</div>
								<div className="HUIInfo">
									<span>Total Fee:</span>
									<span>{VaultItem.totalFee / 10 ** 18}</span>
								</div>
								<div className="HUIInfo">
									<span>Current Reward:</span>
									<span>{VaultItem.currentReward}</span>
								</div>
								<div className="HUIInfo">
									<span>Already Paid:</span>
									<span>{VaultItem.AlreadyPaid / 10 ** 18}</span>
								</div>

								{VaultItem.timeTillNextPay * 1000 >= Date.now() && (
									<div className="HUIInfo">
										<span>Time Till Next Pay:</span>
										<span>
											{new Date(
												VaultItem.timeTillNextPay * 1000
											).toLocaleString()}
										</span>
									</div>
								)}
								{VaultItem.vaultAction === "Entry" && (
									<div className="EntryInput">
										<input
											onChange={(e) => {
												e.preventDefault();
												VaultItem.period = e.target.value;
											}}
											type="number"
											placeholder="Period"
										/>
										<input
											onChange={(e) => {
												e.preventDefault();
												VaultItem.amountPerPeriod = e.target.value;
											}}
											type="number"
											placeholder="Amount per period"
										/>
									</div>
								)}

								{VaultItem.vaultAction === "Pay Fee" && (
									<div className="PayFeeInput">
										<input
											onChange={(e) => {
												e.preventDefault();
												VaultItem.payAmount = e.target.value;
											}}
											type="number"
											placeholder="Pay Amount"
										/>
									</div>
								)}

								<div
									onClick={async () => {
										const action = VaultItem.vaultAction;
										switch (action) {
											case "Entry":
												handleEntryVault(
													VaultItem.address,
													VaultItem.period,
													VaultItem.amountPerPeriod
												);
												break;
											case "Withdraw":
												handleWithdrawVault(VaultItem.address);
												break;
											case "Pay Fee":
												handlePayFee(VaultItem.address, VaultItem.payAmount);
												break;
											default:
												break;
										}
									}}
									className="HUIButton"
								>
									{VaultItem.vaultAction}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}
