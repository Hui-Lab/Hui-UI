import { http, createConfig } from "wagmi";
import { polygonZkEvmTestnet, lineaTestnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [lineaTestnet, polygonZkEvmTestnet],
  connectors: [injected()],
  transports: {
    lineaTestnet: http(),
    polygonZkEvmTestnet: http(),
  },
});
