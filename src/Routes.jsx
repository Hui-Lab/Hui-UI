import { createBrowserRouter, Navigate } from "react-router-dom";
import Navbar from "./assets/Component/Navbar/Navbar";
import Vault from "./assets/Component/Vault/Vault";
import Deposit from "./assets/Component/Deposit/Deposit";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<>
				<Navbar></Navbar>
			</>
		),
	},
	{
		path: "/vault",
		element: (
			<>
				<Navbar></Navbar>
				<Vault></Vault>
			</>
		),
	},
	{
		path: "/deposit",
		element: (
			<>
				<Navbar></Navbar>
				<Deposit></Deposit>
			</>
		),
	},
]);

export default router;
