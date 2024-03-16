import { useContext, useEffect, useState } from "react";
import "./Exchange.scss";
import { useAccount } from "wagmi";
import { ChainContext } from "../../../Context/ChainContext";
import LineaTokenList from "../../json/LineaTokenList.json";
import PolygonZKEVMTokenList from "../../json/PolygonZKEVMTokenList.json";
import { config } from "../../../wagmiConfig";
import { readContract } from "@wagmi/core"
import { erc20Abi } from "viem";
import { getBalance } from '@wagmi/core'


const Exchange = () => {

    const { activeChain } = useContext(ChainContext);
    const { status, address } = useAccount();

    const getToken = (id) => {
        if (activeChain.chainID === 59140)
            return LineaTokenList[id];
        if (activeChain.chainID === 1442)
            return PolygonZKEVMTokenList[id];
    }
    const [tokenInAmount, setTokenInAmount] = useState(undefined);
    const [tokenOutAmount, setTokenOutAmount] = useState(0);
    const [tokenIn, setTokenIn] = useState(getToken(0));
    const [tokenOut, setTokenOut] = useState(getToken(4));
    const [balanceIn, setBalanceIn] = useState(0);
    const [balanceOut, setBalanceOut] = useState(0);
    const [arrowSwitch, setArrowSwitch] = useState(false);

    useEffect(() => {
        const fetchBalance = async () => {
            const balance = await getBalance(config, {
                address,
                token: '0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068',
                chainId: activeChain.chainID
            });
            console.log(balance);
        }
        fetchBalance();
    }, []);


    const handleChangeInput = (e) => {
        const value = e.target.value;
        console.log(typeof value, "\"", value, "\"");
        const regEx = /([0-9]*[.])?[0-9]+/;
        if ((!regEx.test(value)) || (value.includes('-')) || (value === "")) {
            setTokenInAmount(undefined);
            return;
        }
        const decimalCount = value.split('.')[1]?.length || 0;
        if (decimalCount > 5) {
            return;
        }
        setTokenInAmount(value);
    }





    return <div className="Exchange">
        <h1 className="Title">Exchange</h1>
        <div className="ExchangeContainer">
            <div className="ExchangeInput">
                <div className="ExchangeInputLabel">
                    <div className="tokenSymbolContainer">
                        <img src={tokenIn?.img} alt="" />
                        <span>
                            {tokenIn?.symbol}
                        </span>
                    </div>
                    <span>{balanceIn} {tokenIn?.symbol}</span>
                </div>
                <input
                    value={tokenInAmount}
                    onKeyDown={(e) => {
                        if (e.key === "+") {
                            e.preventDefault();
                            return;
                        }

                        if (e.key === "-") {
                            e.preventDefault();
                            return;
                        }

                    }}
                    onChange={
                        (e) => {
                            handleChangeInput(e);
                        }
                    } type="number" placeholder="0.0" />
            </div>
            <div className="ArrowContainer" onMouseEnter={
                () => {
                    setTimeout(() => {
                        setArrowSwitch(true);
                    }, 100);
                }
            } onMouseLeave={
                () => {
                    setTimeout(() => {
                        setArrowSwitch(false);
                    }, 100);
                }

            }>
                {
                    !arrowSwitch && <svg viewBox="0 0 24 24" className="icon-down" fill="#fff" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M11 5V16.17L6.11997 11.29C5.72997 10.9 5.08997 10.9 4.69997 11.29C4.30997 11.68 4.30997 12.31 4.69997 12.7L11.29 19.29C11.68 19.68 12.31 19.68 12.7 19.29L19.29 12.7C19.68 12.31 19.68 11.68 19.29 11.29C18.9 10.9 18.27 10.9 17.88 11.29L13 16.17V5C13 4.45 12.55 4 12 4C11.45 4 11 4.45 11 5Z"></path></svg>
                }
                {
                    arrowSwitch && <svg viewBox="0 0 24 24" className="icon-up-down" fill="#fff" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M16 17.01V11c0-.55-.45-1-1-1s-1 .45-1 1v6.01h-1.79c-.45 0-.67.54-.35.85l2.79 2.78c.2.19.51.19.71 0l2.79-2.78c.32-.31.09-.85-.35-.85H16zM8.65 3.35L5.86 6.14c-.32.31-.1.85.35.85H8V13c0 .55.45 1 1 1s1-.45 1-1V6.99h1.79c.45 0 .67-.54.35-.85L9.35 3.35a.501.501 0 00-.7 0z"></path></svg>
                }
            </div>
            <div className="ExchangeOutput">
                <div className="ExchangeOutputLabel">
                    <div className="tokenSymbolContainer">
                        <img src={tokenOut?.img} alt="" />
                        <span>
                            {tokenOut?.symbol}
                        </span>
                    </div>
                    <span>{tokenOutAmount} {tokenOut?.symbol}</span>
                </div>
                <input disabled={true} type="number" placeholder="0.0" />
            </div>
            <button className="ExchangeButton">
                Exchange
            </button>
        </div>
    </div >;
}

export default Exchange;