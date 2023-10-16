import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useNetwork
} from "wagmi";
import contractAbi from "./resources/contracts/polygon-mumbai/0x34bE7f35132E97915633BC1fc020364EA5134863.json";
import { Button, Anchor, createStyles, Title, Text, Container, Flex } from '@mantine/core';
import { buildSerializedSessionKeyParams } from "./SessionkeyCreate";
import { botRequest } from "./util";
import { useParams } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ReactComponent as ZeroDevLogo } from './resources/assets/images/logo.svg';
import Passkey from './Passkey';
import { ZeroDevWeb3Auth } from '@zerodev/web3auth';

export function SessionKeyExample() {
  const { address } = useAccount();
  const { chain } = useNetwork()

  const { tgId, sessionPublicKey, verificationCode } = useParams();

  const [hasSessionKey, setHasSessionKey] = useState(false)

  console.log(`tgId--- ${tgId}`)
  console.log(`sessionPublicKey--- ${sessionPublicKey}`)
  console.log(`verificationCode--- ${verificationCode}`)

  const [balanceChanging, setBalanceChanging] = useState(false)


  const { config } = usePrepareContractWrite({
    address: "0x34bE7f35132E97915633BC1fc020364EA5134863",
    abi: contractAbi,
    functionName: "mint",
    args: [address],
  });
  const { write: mint } = useContractWrite(config);

  const { data: balance = 0, refetch } = useContractRead({
    address: "0x34bE7f35132E97915633BC1fc020364EA5134863",
    abi: contractAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const { isConnected } = useAccount();

    useEffect(() => {
        if (isConnected) {
            const zeroDevWeb3Auth = new ZeroDevWeb3Auth(['0864346d-c650-4383-830b-35bdfd2fa5be'])
            zeroDevWeb3Auth.getUserInfo().then(console.log)
        }
    }, [isConnected])

  useEffect(() => {
    if (balance) {
      setBalanceChanging(false)
    }
  }, [balance])

  const interval = useRef<any>()

  const handleClick = useCallback(() => {
    if (mint) {
      setBalanceChanging(true)
      mint()
      interval.current = setInterval(() => {
        refetch()
      }, 1000)
      setTimeout(() => {
        if (interval.current) {
          clearInterval(interval.current)
        }
      }, 100000)
    }
  }, [mint, refetch])

  const sessionkeyClick = async () => {
    if (sessionPublicKey && sessionPublicKey.startsWith('0x')) {
      //@ts-ignore
      const res = await buildSerializedSessionKeyParams(publicKey)
      console.log(`res--- ${JSON.stringify(res)}`)
      const data = {
        tgId,
        serializeSessionKeyParams: res,
        verificationCode
      }
      const bind = await botRequest({ url: `api/binding`, method: 'GET', data })
      console.log(`bind--- ${JSON.stringify(bind)}`)
      if (bind) {
        setHasSessionKey(true)
      }
    }
  };

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current)
    }
  }, [balance, interval]);

  return (
    <Container h={'100vh'}>
      <Flex justify={"center"} align="center" mih={'100%'} direction={'column'} gap={30}>
        <ZeroDevLogo width={300} height={'100%'} />
        {!isConnected &&<Passkey />}
        Tradao will create an AA wallet for you using passkeys.
        {isConnected && hasSessionKey && <ConnectButton/>}
        {isConnected && !hasSessionKey && <Button
          loading={balanceChanging}
          size={'lg'}
          onClick={sessionkeyClick}
        >
         Create Session Key
        </Button>}
      </Flex>
    </Container>
  );
}

