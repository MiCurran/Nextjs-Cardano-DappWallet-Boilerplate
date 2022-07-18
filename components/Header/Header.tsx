import * as React from "react";
import { Ellipsis } from "../Ellipsis";
import { Box, Button, Link, Text } from "@chakra-ui/react";
import { CloseCircle } from "@styled-icons/evaicons-solid/CloseCircle";
import { WalletDialog } from "./WalletDialog";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getAddressBech32, getCardano, getSelectedWallet } from "../../lib/utils";
import { setSelectedWallet } from "./wallet";

const Logo = () => {
  return (<Text>Logo</Text>)
};

type HeaderProps = {
  landing?: boolean;
};

export const Header = (props: HeaderProps) => {
  const dialogRef = React.useRef<any>();
  const [wallet, setWallet, resetWallet] = [
    useStoreState<any>((state) => state.wallet.wallet),
    useStoreActions<any>((actions) => actions.wallet.setWallet),
    useStoreActions<any>((actions) => actions.wallet.resetWallet),
  ];
  const cardano = getCardano();

  const reset = () => {
    delete cardano.selectedWallet;
    resetWallet();
  };

  const init = async () => {
    if (!cardano) return;
    if (!wallet.address) return;
    const selected = await setSelectedWallet(wallet.walletName);
    if (!selected) {
      reset();
      return;
    }
    if (wallet.walletName === "nami") {
      const selectedWallet = await getSelectedWallet();
      selectedWallet.experimental.on("accountChange", async () => {
        const address = getAddressBech32(
          (await selectedWallet.getUsedAddresses())[0]
        );
        setWallet({ ...wallet, address, sessionTime: Date.now() });
      });
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <>
     {wallet?.address ? (
            <Box>
                <Ellipsis>
                  {wallet.address}
                </Ellipsis>
              <Button
                onClick={reset}
              >
                <CloseCircle />
              </Button>
            </Box>
          ) : (
            <Button
              onClick={() => {
                dialogRef.current.open();
              }}
            >
              Connect Wallet
            </Button>
          )}
      <WalletDialog ref={dialogRef} />
    </>
         
  );
};
