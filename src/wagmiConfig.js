import { http, createConfig } from "wagmi";
import { polygonZkEvmTestnet, lineaTestnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
	chains: [polygonZkEvmTestnet, lineaTestnet],
	connectors: [injected()],
	transports: {
		[polygonZkEvmTestnet.id]: http(),
		[lineaTestnet.id]: http(),
	},
});
