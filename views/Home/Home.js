import { CustomHead } from '../../components/Head'
import styles from '../../styles/Home.module.scss'
import ConnectWallet from '../../components/Wallet/ConnectWallet';
import {
VStack,
Box,
Heading,
Text,
Link
} from '@chakra-ui/react'
import { useStoreState } from 'easy-peasy';

const NamiWalletWrapper = ({connected}) => {
  return ( <VStack> 
    <Heading>Nami Wallet is {connected === null ? 'not connected :(' : 'connected!'}</Heading>
    <ConnectWallet />
  </VStack>);
};

export default function Home(props) {
  const connected = useStoreState((state) => state.connection.connected);
  const {latestBlock} = props;
  return (
    <Box className={styles.container}>
        <CustomHead title="page title" />
      <Box className={styles.main}>
        <Heading className={styles.title} color="brand.900">
          <Link href="https://nextjs.org">Next.js Nami Wallet integration!</Link>
        </Heading>
        <Text className={styles.description}>
          Boilerplate with Chakra UI - SASS
        </Text>
        <Text mb="10">
          Interact with the Nami wallet to view and sign transactions on the cardano blockchain
        </Text>
        <NamiWalletWrapper connected={connected} />
        <Box className={styles.grid}>
          <Heading fontSize="xl">Server-Side rendering calls from Blockfrost API</Heading>
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://blockfrost.io/dashboard"
            className={styles.card}
          >
            <Heading 
              as="h2" 
              fontSize="2xl"
            >
              Current Epoch &rarr;
            </Heading>
            {latestBlock
              ? <Text>{latestBlock.epoch}</Text>
              : <Text>Not connected to Blockfrost. API KEY NEEDED</Text>
            }
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
