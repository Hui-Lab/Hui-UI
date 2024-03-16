import { useContext, useEffect, useState } from "react";
import "./Exchange.scss";
import { useAccount } from "wagmi";
import { ChainContext } from "../../../Context/ChainContext";
import LineaTokenList from "../../json/LineaTokenList.json";
import PolygonZKEVMTokenList from "../../json/PolygonZKEVMTokenList.json";
import { config } from "../../../wagmiConfig";
import { getBalance, writeContract } from '@wagmi/core'
import { Modal } from "antd";
import HUIProvider from "../../json/ABI/HUIProvider.json";
import { readContract } from "viem/actions";
import { erc20Abi } from "viem";
import { parseUnits } from "ethers/lib/utils";

const Exchange = () => {

    const { activeChain } = useContext(ChainContext);
    const { address } = useAccount();

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

    const getTokenList = () => {
        if (activeChain.chainID === 59140)
            return LineaTokenList.slice(0, 4);
        if (activeChain.chainID === 1442)
            return PolygonZKEVMTokenList.slice(0, 4);
    }

    const [modalOpen, setModalOpen] = useState(false);

    const handleChangeTokenIn = () => {
        if (tokenIn.symbol === "HUI") {
            return;
        }
        setModalOpen(true);
    }

    const handleChangeTokenOut = () => {
        if (tokenOut.symbol === "HUI") {
            return;
        }
        setModalOpen(true);
    }

    useEffect(() => {
        const fetchBalance = async () => {
            const balance = await getBalance(config, {
                address,
                token: tokenIn.address,
                chainId: activeChain.chainID
            });
            setBalanceIn(balance.formatted);
        }
        fetchBalance();
    }, [tokenIn]);

    useEffect(() => {
        const fetchBalance = async () => {
            const balance = await getBalance(config, {
                address,
                token: tokenOut.address,
                chainId: activeChain.chainID
            });
            setBalanceOut((balance.formatted));
        }
        fetchBalance();
    }, [tokenOut]);

    const handleSwitchToken = () => {
        setTokenInAmount(undefined);
        setTokenOutAmount(0);
        setBalanceIn(0);
        setBalanceOut(0);
        const tempToken = tokenIn;
        setTokenIn(tokenOut);
        setTokenOut(tempToken);
    }



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
        if (parseFloat(value) > parseFloat(balanceIn)) {
            setTokenInAmount(balanceIn);
            setTokenOutAmount(balanceIn);
            return;
        }
        setTokenInAmount(value);
        setTokenOutAmount(value);
    }

    const getHUIProviderAddress = () => {
        if (activeChain.chainID === 59140)
            return import.meta.env.VITE_HUI_PROVIDER_ADDRESS_LINEA_TESTNET;
        if (activeChain.chainID === 1442)
            return import.meta.env.VITE_HUI_PROVIDER_ADDRESS_POLYGON_ZK_TESTNET;
    }

    const getHUIAddress = () => {
        if (activeChain.chainID === 59140)
            return LineaTokenList[4].address;
        if (activeChain.chainID === 1442)
            return PolygonZKEVMTokenList[4].address;
    }

    const handleExchange = async () => {
        if (tokenIn.symbol === "HUI") {
            return;
        }

        const balance = await readContract(config, {
            abi: erc20Abi,
            address: tokenIn.address,
            functionName: "balanceOf",
            args: [address]
        });

        console.log(balance);

        const allowance = await readContract(config, {
            abi: erc20Abi,
            address: tokenIn.address,
            functionName: "allowance",
            args: [address, getHUIProviderAddress()]
        });

        if (toString(allowance) < parseUnits(tokenInAmount, tokenIn.decimals)) {
            const approveResult = await writeContract(config, {
                abi: erc20Abi,
                address: tokenIn.address,
                functionName: "approve",
                args: [getHUIProviderAddress(), parseUnits(tokenInAmount, tokenIn.decimals)]
            });
            console.log(approveResult);
        }


        const result = await writeContract(config, {
            abi: HUIProvider,
            address: getHUIProviderAddress(),
            functionName: "deposit",
            args: [tokenIn.address, parseUnits(tokenInAmount, tokenIn.decimals)]
        });
        console.log(result);
    }


    return <div className="Exchange">
        <h1 className="Title">Exchange</h1>
        <div className="ExchangeContainer">
            <div className="ExchangeInput">
                <div className="ExchangeInputLabel">
                    <div onClick={() => { handleChangeTokenIn() }} className={`tokenSymbolContainer ${tokenIn.symbol === "HUI" ? "" : "Changeable"
                        }`}> <img src={tokenIn?.img} alt="" />
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
                            if (e.target.value === "") {
                                setTokenOutAmount(0);
                            }
                        }
                    } type="number" placeholder="0.0" />
            </div>
            <div className="ArrowContainer"
                onMouseEnter={
                    () => {
                        setTimeout(() => {
                            setArrowSwitch(true);
                        }, 100);
                    }
                }
                onMouseLeave={
                    () => {
                        setTimeout(() => {
                            setArrowSwitch(false);
                        }, 100);
                    }

                }

                onClick={() => {
                    handleSwitchToken();
                }}

            >
                {
                    !arrowSwitch && <svg viewBox="0 0 24 24" className="icon-down" fill="#fff" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M11 5V16.17L6.11997 11.29C5.72997 10.9 5.08997 10.9 4.69997 11.29C4.30997 11.68 4.30997 12.31 4.69997 12.7L11.29 19.29C11.68 19.68 12.31 19.68 12.7 19.29L19.29 12.7C19.68 12.31 19.68 11.68 19.29 11.29C18.9 10.9 18.27 10.9 17.88 11.29L13 16.17V5C13 4.45 12.55 4 12 4C11.45 4 11 4.45 11 5Z"></path></svg>
                }
                {
                    arrowSwitch && <svg viewBox="0 0 24 24" className="icon-up-down" fill="#fff" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M16 17.01V11c0-.55-.45-1-1-1s-1 .45-1 1v6.01h-1.79c-.45 0-.67.54-.35.85l2.79 2.78c.2.19.51.19.71 0l2.79-2.78c.32-.31.09-.85-.35-.85H16zM8.65 3.35L5.86 6.14c-.32.31-.1.85.35.85H8V13c0 .55.45 1 1 1s1-.45 1-1V6.99h1.79c.45 0 .67-.54.35-.85L9.35 3.35a.501.501 0 00-.7 0z"></path></svg>
                }
            </div>
            <div className="ExchangeOutput">
                <div className="ExchangeOutputLabel">
                    <div onClick={() => { handleChangeTokenOut() }} className={`tokenSymbolContainer ${tokenOut.symbol === "HUI" ? "" : "Changeable"
                        }`}>
                        <img src={tokenOut?.img} alt="" />
                        <span>
                            {tokenOut?.symbol}
                        </span>
                    </div>
                    <span>{balanceOut} {tokenOut?.symbol}</span>
                </div>
                <input
                    value={tokenOutAmount}
                    disabled={true}
                    type="number"
                    placeholder="0.0" />
            </div>
            <button onClick={() => {
                handleExchange();
            }} className="ExchangeButton">
                Exchange
            </button>
        </div>

        <Modal
            open={modalOpen}
            title="Select a token"
            footer={null}
            width={300}
            height={300}
            onCancel={() => {
                setModalOpen(false);
            }}
        >
            <div className="SwapModal">
                {getTokenList().map((token, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                if (tokenIn.symbol !== "HUI") {
                                    setTokenIn(token);
                                }
                                if (tokenOut.symbol !== "HUI") {
                                    setTokenOut(token);
                                }
                                setModalOpen(false);
                            }}
                            className="SwapModalItem"
                        >
                            {token.img && <img src={token.img} alt="icon" />}
                            {token.name}
                        </div>
                    );
                })}
            </div>
        </Modal>
    </div >;
}

export default Exchange;