import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useNetwork
} from "wagmi";
import contractAbi from "../resources/contracts/polygon-mumbai/0x34bE7f35132E97915633BC1fc020364EA5134863.json";
import { Button, Anchor, Flex } from '@mantine/core';
import { Page } from '../Page'
import { buildSerializedSessionKeyParams } from "./SessionkeyCreate";
import { botRequest } from "./util";

const description = `With Tradao, you can pay gas for your users, so they don't have to buy ETH before using your app.`

export function SessionKeyExample() {
  const { address } = useAccount();
  const { chain } = useNetwork()

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
    const res = await buildSerializedSessionKeyParams('0x123')
    console.log(`res--- ${JSON.stringify(res)}`)
    botRequest({ url: 'v1/td/dashboard/0/gmx/pnlTop/12/desc/86400/0/' })
  };

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current)
    }
  }, [balance, interval]);

  return (
    <Page title={"Tradao AA"} description={description}>
      <Flex align={'center'} justify={'center'} direction={'column'} gap={'1rem'} style={{ flex: 1 }}>
        <Button
          loading={balanceChanging}
          size={'lg'}
          onClick={sessionkeyClick}
        >
          Session Key
        </Button>
      </Flex>
    </Page>
  );
}

