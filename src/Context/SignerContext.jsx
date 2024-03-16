import { createContext } from "react";
import { ethers } from "ethers";

export const SignerContext = createContext();

export const SignerContextProvider = ({ children }) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    return (
        <SignerContext.Provider
            value={{
                signer,
                provider,
            }}
        >
            {children}
        </SignerContext.Provider>
    );
};