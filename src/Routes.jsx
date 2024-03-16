import { createBrowserRouter, Navigate } from "react-router-dom";
import Header from "./assets/Component/Header/Header";
import Exchange from "./assets/Component/Exchange/Exchange";
import Vault from "./assets/Component/Vault/Vault";
import SideBar from "./assets/Component/SideBar/SideBar";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Navigate to="/Exchange" />,

	},
	{
		path: "/Exchange",
		element: (
			<>
				<Header />
				<SideBar />
				<Exchange />
			</>
		),

	},
	{
		path: "/Vault",
		element: (
			<>
				<Header />
				<SideBar />
				<Vault />
			</>
		),
	},
]);

export default router;
