import { createContext, useEffect, useState } from "react";
import ChainList from "../assets/json/ChainList.json";

import { useSwitchChain } from "wagmi";

export const ChainContext = createContext();

export const ChainContextProvider = ({ children }) => {
  const [activeChain, setActiveChain] = useState(ChainList[0]);
  const { switchChainAsync } = useSwitchChain();
  const handleChangeChain = async (id) => {
    console.log("Switching chain to:", id);
    try {
      await switchChainAsync({ chainId: id });

      switch (id) {
        case 59140:
          setActiveChain(ChainList[0]);
          break;
        case 1442:
          setActiveChain(ChainList[1]);
          break;
        default:
          console.error("Unsupported chain ID:", id);
          break;
      }
    } catch (error) {
      console.error("Error while switching chain:", error);
    }
  };

  return (
    <ChainContext.Provider value={{ activeChain, handleChangeChain }}>
      {children}
    </ChainContext.Provider>
  );
};
