import { useAccount, useConnect, useDisconnect } from "wagmi";
import "./Header.scss";
import ChainList from "../../json/ChainList.json"
import { useContext, useState } from "react";
import { Dropdown } from "antd";
import { ChainContext } from "../../../Context/ChainContext";


const Header = () => {

	const { connectAsync, connectors } = useConnect();
	const { disconnect } = useDisconnect();
	const { status, address } = useAccount();
	// const [activeChain, setActiveChain] = useState(ChainList[0]);
	const { activeChain, handleChangeChain } = useContext(ChainContext);

	const handleConnectWallet = async () => {
		if (address) {
			disconnect();
			return;
		}

		await connectAsync({ connector: connectors[0] });
		await handleChangeChain(activeChain.chainID);
	};

	const items = ChainList.map((chain, index) => {
		return {
			label: (
				<div
					className="ChainSelectDropDownItem"
					onClick={(e) => {
						handleChangeChain(chain.chainID);
					}}
				>
					<img src={chain.iconURL} alt={chain.chainName} />
					{chain.chainName}
				</div>
			),
			key: index,
		};
	});


	return (
		<div className="Header">
			<div className="NavLeft">
				<img src="/HUI.png" className="logo" />
				<span>HUI</span>
			</div>

			<div className="NavRight">
				<Dropdown menu={{ items }} className="ChainSelectDropdown">
					<div onClick={(e) => e.preventDefault()} className="ChainSelectDropdownDefault">
						<img src={activeChain.iconURL} alt={activeChain.chainName} />
						{activeChain.chainName}
					</div>
				</Dropdown>
				<div className="ConnectButton" onClick={handleConnectWallet}>
					{status === "connected"
						? address.slice(0, 4) + "..." + address.slice(38)
						: "Connect Wallet"}
				</div >
			</div>
		</div>
	);
};

export default Header;
