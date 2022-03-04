/* eslint-disable react/display-name */
import React from "react";
import * as style from "./ConnectWallet.module.scss";

import Loader from "../../cardano/loader";

// Asset
import { useStoreActions, useStoreState } from "easy-peasy";
import {
  Button,
  Box,
  useToast,
  Popover,
  PopoverTrigger,
  useBreakpoint,
  PopoverContent,
  PopoverBody,
  SimpleGrid,
  useDisclosure,
  IconButton,
  Tooltip,
  Link,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/image";
import MiddleEllipsis from "react-middle-ellipsis";
import { ChevronRightIcon, InfoIcon, SmallCloseIcon } from "@chakra-ui/icons";

// backwards compatibility until all Nami users have updated
const isBrowser = () => typeof window !== "undefined";

if (
  isBrowser() &&
  window.cardano &&
  window.cardano.enable &&
  !window.cardano.nami
) {
  window.cardano.nami = {
    enable: async () => {
      if (await window.cardano.enable()) {
        return {
          getBalance: () => window.cardano.getBalance(),
          signData: (address, payload) =>
            window.cardano.signData(address, payload),
          signTx: (tx, partialSign) => window.cardano.signTx(tx, partialSign),
          submitTx: (tx) => window.cardano.submitTx(tx),
          getUtxos: (amount, paginate) =>
            window.cardano.getUtxos(amount, paginate),
          getUsedAddresses: () => window.cardano.getUsedAddresses(),
          getUnusedAddresses: async () => [],
          getChangeAddress: () => window.cardano.getChangeAddress(),
          getRewardAddresses: () => window.cardano.getRewardAddresses(),
          getNetworkId: () => window.cardano.getNetworkId(),
          experimental: {
            on: (eventName, callback) => {
              if (eventName == "accountChange")
                window.cardano.onAccountChange(callback);
              else if (eventName == "networkChange")
                window.cardano.onNetworkChange(callback);
            },
            off: (eventName, callback) =>
              window.cardano.off(eventName, callback),
            getCollateral: () => window.cardano.getCollateral(),
          },
        };
      }
    },
    isEnabled: () => window.cardano.isEnabled(),
    apiVersion: "0.1.0",
    name: "Nami",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 486.17 499.86'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23349ea3;%7D%3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpath id='path16' class='cls-1' d='M73.87,52.15,62.11,40.07A23.93,23.93,0,0,1,41.9,61.87L54,73.09,486.17,476ZM102.4,168.93V409.47a23.76,23.76,0,0,1,32.13-2.14V245.94L395,499.86h44.87Zm303.36-55.58a23.84,23.84,0,0,1-16.64-6.68v162.8L133.46,15.57H84L421.28,345.79V107.6A23.72,23.72,0,0,1,405.76,113.35Z'/%3E%3Cpath id='path18' class='cls-1' d='M38.27,0A38.25,38.25,0,1,0,76.49,38.27v0A38.28,38.28,0,0,0,38.27,0ZM41.9,61.8a22,22,0,0,1-3.63.28A23.94,23.94,0,1,1,62.18,38.13V40A23.94,23.94,0,0,1,41.9,61.8Z'/%3E%3Cpath id='path20' class='cls-1' d='M405.76,51.2a38.24,38.24,0,0,0,0,76.46,37.57,37.57,0,0,0,15.52-3.3A38.22,38.22,0,0,0,405.76,51.2Zm15.52,56.4a23.91,23.91,0,1,1,8.39-18.18A23.91,23.91,0,0,1,421.28,107.6Z'/%3E%3Cpath id='path22' class='cls-1' d='M134.58,390.81A38.25,38.25,0,1,0,157.92,426a38.24,38.24,0,0,0-23.34-35.22Zm-15,59.13A23.91,23.91,0,1,1,143.54,426a23.9,23.9,0,0,1-23.94,23.91Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    _events: {},
  };
}

const addressToBech32 = async () => {
  await Loader.load();
  console.log(await window.cardano.selectedWallet.name);
  const address = (await window.cardano.selectedWallet.getUsedAddresses())[0];
  return Loader.Cardano.Address.from_bytes(
    Buffer.from(address, "hex")
  ).to_bech32();
};
const StartButton = (props) => {
  const matches = useBreakpoint();
  const [isLoading, setIsLoading] = React.useState(false);
  const [flag, setFlag] = React.useState(false);
  const connected = useStoreState((state) => state.connection.connected);
  const setConnected = useStoreActions(
    (actions) => actions.connection.setConnected
  );
  const connectedWallet = useStoreState((state) => state.connectedWallet);
  const setConnectedWallet = useStoreActions(
    (actions) => actions.wallet.setConnectedWallet
  );
  const { onOpen, onClose, isOpen } = useDisclosure();
  const toast = useToast();

  const [hasCardano, setHasCardano] = React.useState(null);

  React.useEffect(() => {
    if (connected && !flag)
      window.cardano.selectedWallet.name === "Nami" &&
        window.cardano.selectedWallet.experimental.on(
          "accountChange",
          async () => {
            const address = await addressToBech32();
            setConnected(address);
            setFlag(true);
          }
        );
  }, [connected]);

  React.useEffect(() => {
    setHasCardano(window.cardano);
  }, []);

  const checkConnection = async () => {
    if (window.cardano) {
      const session = JSON.parse(localStorage.getItem("session"));
      if (!session) return;
      if (!(await window.cardano[session.walletName].isEnabled())) return;
      setConnectedWallet(session.walletName)
      const api = await window.cardano[session.walletName]
        .enable()
        .catch((e) => {});
      if (api) {
        if (!(await checkStatus(toast, api))) {
          return;
        }
        if (session.walletName === "flint") {
          window.cardano.selectedWallet = {
            ...window.cardano[session.walletName],
            ...api,
            experimental: {
              getCollateral: api.getCollateral,
            },
          };
        } else {
          window.cardano.selectedWallet = {
            ...window.cardano[session.walletName],
            ...api,
          };
        }
      }
      if (Date.now() - parseInt(session.time) < 6000000) {
        //1h
        const address = await addressToBech32();
        setConnected(address);
      }
    }
  };

  React.useEffect(() => {
    checkConnection();
  }, []);

  return connected ? (
    <Box 
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        rounded={'2xl'}
        border={'1.5px solid'}
        borderColor={'teal.500'}
        className={style.clay}
        p={2.5}
        
    >
      <Image src={window.cardano.selectedWallet.icon} height={"18px"} />
      <Box w={2} />
      <div
        className={style.accountButton}
        style={{
          width: 100,
          zoom: matches.md && "0.85",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Ellipsis connected={connected} />
      </div>
      <Box w={1} />
      <Tooltip label={"Disconnect"}>
        <IconButton
          size={"xs"}
          bgColor={'white'}
          rounded={"full"}
          icon={<SmallCloseIcon />}
          onClick={() => {
            delete window.cardano.selectedWallet;
            localStorage.removeItem("session");
            setConnected("");
            setConnectedWallet("")
          }}
        />
      </Tooltip>
    </Box>
  ) : (
    <Popover onOpen={onOpen} onClose={onClose} isOpen={isOpen}>
      <PopoverTrigger>
        <Button
          isDisabled={isLoading}
          isLoading={isLoading}
          colorScheme="teal"
          rounded="lg"
          position="relative"
          overflow="hidden"
          py="0.5"
        >
          <Box zIndex="1">Choose Wallet</Box>
        </Button>
      </PopoverTrigger>
      <PopoverContent width={"210px"}>
        <PopoverBody
          display={"flex"}
          alignContent={"center"}
          justifyContent={"center"}
          flexDir={"column"}
        >
          <Box h={2} />
          <Box fontWeight={"bold"} textAlign={"center"}>
            Choose wallet
          </Box>
          <Box h={4} />
          {hasCardano ? (
            <SimpleGrid width={"full"} columns={2} spacing={4}>
              {window.cardano &&
                Object.keys(window.cardano)
                  .filter(
                    (walletName) =>
                      walletName == "nami" || walletName == "ccvault"
                    // walletName === "flint"
                  )
                  .map((walletName) => (
                    <Box
                      key={walletName}
                      width={"90px"}
                      height={"90px"}
                      _hover={{ background: "gray.100", rounded: "xl" }}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      flexDirection={"column"}
                      cursor={"pointer"}
                      onClick={async () => {
                        setIsLoading(true);
                        onClose();
                        const api = await window.cardano[walletName]
                          .enable()
                          .catch((e) => {});
                        if (api) {
                          if (!(await checkStatus(toast, api))) {
                            setIsLoading(false);
                            return;
                          }
                          if (walletName === "flint") {
                            window.cardano.selectedWallet = {
                              ...window.cardano[walletName],
                              ...api,
                              experimental: {
                                getCollateral: api.getCollateral,
                              },
                            };
                          } else {
                            window.cardano.selectedWallet = {
                              ...window.cardano[walletName],
                              ...api,
                            };
                          }
                          const address = await addressToBech32();
                          setConnected(address);
                          localStorage.setItem(
                            "session",
                            JSON.stringify({
                              time: Date.now().toString(),
                              walletName,
                            })
                          );
                        }
                        setIsLoading(false);
                      }}
                    >
                      <Image
                        src={window.cardano[walletName].icon}
                        width={"40px"}
                      />
                      <Box h={1} />
                      <Box fontWeight={"medium"}>
                        {window.cardano[walletName].name}
                      </Box>
                    </Box>
                  ))}
            </SimpleGrid>
          ) : (
            <Box textAlign={"center"} width={"full"}>
              <Box> No wallet found</Box>
              <Link
                onClick={() => window.open("https://namiwallet.io")}
                color={"purple.400"}
                colorScheme={"purple"}
                fontSize={"13"}
                fontWeight={"light"}
              >
                Get Nami
              </Link>
              <Box h={2} />
            </Box>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const Ellipsis = ({ connected }) => {
  const [change, setChange] = React.useState(false);

  React.useEffect(() => {
    setChange(true);
    setTimeout(() => setChange(false));
  }, [connected]);

  return (
    !change && (
      <div
        style={{
          width: "130px",
          whiteSpace: "nowrap",
          fontWeight: "bold",
          fontSize: 14,
        }}
      >
        <MiddleEllipsis>
          <span>{connected}</span>
        </MiddleEllipsis>
      </div>
    )
  );
};

export default StartButton;

const checkStatus = async (toast, api) => {
  return (
    // NoNami(toast) &&
    // (await window.cardano.enable().catch((e) => {})) &&
    await WrongNetworkToast(toast, api)
  );
};

const NoNami = (toast) => {
  if (window.cardano) return true;
  toast({
    position: "bottom-right",
    render: () => (
      <Box
        background="purple.400"
        color="white"
        px={6}
        py={3}
        rounded="3xl"
        display="flex"
        alignItems="center"
      >
        <InfoIcon />
        <Box ml="3" fontWeight="medium">
          Nami not installed
        </Box>
        <Button
          rounded="3xl"
          colorScheme="whiteAlpha"
          onClick={() => window.open("https://namiwallet.io")}
          ml="4"
          size="xs"
          rightIcon={<ChevronRightIcon />}
        >
          Get it
        </Button>
      </Box>
    ),
    duration: 9000,
  });
  return false;
};

const WrongNetworkToast = async (toast, api) => {
  if ((await api.getNetworkId()) === 1) return true;
  toast({
    position: "bottom-right",
    duration: 5000,
    render: () => (
      <Box
        background="purple.400"
        color="white"
        px={6}
        py={3}
        rounded="3xl"
        display="flex"
        alignItems="center"
      >
        <InfoIcon />
        <Box ml="3" fontWeight="medium">
          Wrong network
        </Box>
      </Box>
    ),
  });
  return false;
};