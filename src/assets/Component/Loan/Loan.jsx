import { useContext } from "react";
import "./Loan.scss";
import { ChainContext } from "../../../Context/ChainContext";

const LoanLineaTestnet = (explorerURL) => {
	explorerURL = explorerURL.explorerURL;
	return (
		<table class="styled-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Address</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>HUI Token</td>
					<td>
						<a
							href={
								explorerURL +
								`address/0xaCb1770f375f07bC00DfdbfE12daB0e5CC784C41`
							}
						>
							0xaCb1770f375f07bC00DfdbfE12daB0e5CC784C41
						</a>
					</td>
				</tr>
				<tr>
					<td>HUI Provider</td>
					<td>
						<a
							href={
								explorerURL +
								`address/0xB253170687506419789eE0d8b01DdbdEEb13c5d3`
							}
						>
							0xB253170687506419789eE0d8b01DdbdEEb13c5d3
						</a>
					</td>
				</tr>
				<tr>
					<td>HUI Protocol Github</td>
					<td>
						{" "}
						<a href={"https://github.com/orgs/Hui-Lab/repositories"}>
							https://github.com/orgs/Hui-Lab/repositories
						</a>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

const LoanPolygonZKEVMTestnet = (explorerURL) => {
	return (
		<table class="styled-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Address</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>HUI Token</td>
					<td>
						<a
							href={
								explorerURL +
								`address/0xaCb1770f375f07bC00DfdbfE12daB0e5CC784C41`
							}
						>
							0xaCb1770f375f07bC00DfdbfE12daB0e5CC784C41
						</a>
					</td>
				</tr>
				<tr>
					<td>HUI Provider</td>
					<td>
						{" "}
						<a
							href={
								explorerURL +
								`address/0x1693Eb83Ef1ec04EA92Eb2DDda50D0Dc0b3030FE`
							}
						>
							0x1693Eb83Ef1ec04EA92Eb2DDda50D0Dc0b3030FE
						</a>
					</td>
				</tr>
				<tr>
					<td>HUI Protocol Github</td>
					<td>
						{" "}
						<a href={"https://github.com/orgs/Hui-Lab/repositories"}>
							https://github.com/orgs/Hui-Lab/repositories
						</a>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default function Loan() {
	const { activeChain } = useContext(ChainContext);

	return (
		<div className="Loan">
			{activeChain.chainID === 59140 ? (
				<LoanLineaTestnet explorerURL={activeChain.explorerURL} />
			) : (
				<LoanPolygonZKEVMTestnet explorerURL={activeChain.explorerURL} />
			)}
		</div>
	);
}
