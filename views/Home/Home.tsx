import { CustomHead } from '../../components/Head'
import styles from '../../styles/Home.module.scss'
import {
VStack,
Box,
Heading,
Text,
Link
} from '@chakra-ui/react'
import {Header} from '../../components/Header/Header'

export default function Home(props) {
  const {latestBlock} = props;
  return (
    <Box className={styles.container}>
        <CustomHead title="page title 2" description='test' />
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
        <Header />
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
