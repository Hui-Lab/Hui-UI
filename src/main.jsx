import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Routes";
import "./reset.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmiConfig";
import { ChainContextProvider } from "./Context/ChainContext";
// import { SignerContextProvider } from "./Context/SignerContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<WagmiProvider config={config}>
		<QueryClientProvider client={queryClient}>
			<ChainContextProvider>
				<RouterProvider router={router} />
			</ChainContextProvider>
		</QueryClientProvider>
	</WagmiProvider>
);
