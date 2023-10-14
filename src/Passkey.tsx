import { Button, Flex } from "@mantine/core";
import { chains, projectId } from "./ZeroDevWrapper";
import { useConnect } from "wagmi";
import { ZeroDevConnector } from "@zerodev/wagmi";
import { createPasskeyOwner, getPasskeyOwner } from '@zerodev/sdk/passkey'
import { useState } from "react";


function Passkey() {
    const [loginLoading, setLoginLoading] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)

    const { connect } = useConnect()

    const handleLogin = async () => {
        setLoginLoading(true)
        connect({
            connector: new ZeroDevConnector({
                chains, options: {
                    projectId,
                    owner: await getPasskeyOwner({ projectId })
                }
            })
        })
        setTimeout(() => setLoginLoading(false), 5000)
    }

    const handleRegister = async () => {
        setRegisterLoading(true)
        connect({
            connector: new ZeroDevConnector({
                chains, options: {
                    projectId,
                    owner: await createPasskeyOwner({ name: 'Tradao', projectId })
                }
            })
        })
        setTimeout(() => setRegisterLoading(false), 5000)
    }


    return (
        <Flex gap={'lg'}>
            <Button
                loading={loginLoading}
                size={'lg'}
                onClick={handleLogin}
            >
                Login
            </Button>
            <Button
                loading={registerLoading}
                size={'lg'}
                onClick={handleRegister}
                variant={'outline'}
            >
                Register
            </Button>
        </Flex>
    )

}

export default Passkey
export { }