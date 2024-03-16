import { http, createConfig } from "wagmi";
import { lineaTestnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const WagmiConfig = createConfig({
	chains: [lineaTestnet],
	connectors: [injected()],
	transports: {
		[lineaTestnet.id]: http(),
	},
});
