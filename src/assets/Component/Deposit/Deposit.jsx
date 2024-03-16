import { useState } from "react";
import "./Deposit.scss";

const simulatedHUI = [
	{
		name: "USDT HUI",
		depositors: [
			"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
			"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
		],
		token: "USDT",
		network: "Linea",
	},
	{
		name: "USDC HUI",
		depositors: [
			"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
			"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
		],
		token: "USDC",
		network: "Linea",
	},
	{
		name: "DAI HUI",
		depositors: [
			"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
			"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
		],
		token: "DAI",
		network: "Linea",
	},
	{
		name: "WBTC HUI",
		depositors: [
			"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
			"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
		],
		token: "WBTC",
		network: "Linea",
	},
	{
		name: "ETH HUI",
		depositors: [
			"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
			"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
		],
		token: "ETH",
		network: "Linea",
	},
];

export default function Deposit() {
	const [listActiveHUI, setListActiveHUI] = useState(simulatedHUI);

	console.log(listActiveHUI);

	return (
		<div className="container">
			{listActiveHUI.length == 0 && <div>No HUI is active</div>}
			{listActiveHUI.length > 0 &&
				listActiveHUI.map((hui, hui_id) => {
					return (
						<div className="hui_container" key={hui_id}>
							<div className="hui_header">
								<img className="token_logo" src={hui.token + ".png"} />
								<div style={{ display: "inline-block" }}>{hui.name}</div>
							</div>
							<div className="hui_content">
								{/* {hui.depositors.map((depositor, depositor_id) => {
									return <div key={depositor_id}>{depositor}</div>;
								})} */}
								<div>
									<div className="hui_property_name">Network</div>
									<div>{hui.network.toString()}</div>
								</div>
							</div>
						</div>
					);
				})}
		</div>
	);
}
