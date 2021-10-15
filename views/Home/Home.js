import { Heading, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { CustomHead } from '../../components/head'
import styles from '../../styles/Home.module.scss'
import ConnectWallet from '../../components/Wallet/ConnectWallet';
import {
VStack,
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
  return (
    <div className={styles.container}>
        <CustomHead title="page title" />
      <main className={styles.main}>
        <Heading className={styles.title} color="brand.900">
          <a href="https://nextjs.org">Next.js Nami Wallet integration!</a>
        </Heading>

        <Text className={styles.description}>
          Boilerplate with Chakra UI - SASS
        </Text>
        <Text mb="10">Interact with the Nami wallet to view and sign transactions on the cardano blockchain</Text>
        <NamiWalletWrapper connected={connected} />
        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
