import { http, createConfig } from "wagmi";
import { polygonZkEvmTestnet, lineaTestnet } from "wagmi/chains";
import { createClient } from "viem";

export const config = createConfig({
  chains: [lineaTestnet, polygonZkEvmTestnet],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});
