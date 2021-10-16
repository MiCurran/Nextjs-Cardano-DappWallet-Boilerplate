import styles from '../../styles/Home.module.scss'
import ConnectWallet from '../../components/Wallet/ConnectWallet';
import {
Box,
Text,
} from '@chakra-ui/react'

const codeStyle = {backgroundColor: '#cccccc'}

export default function Address(props) {
  const {addressInfo} = props;
  return (
    <Box className={styles.container}>
      <Text fontSize="2xl">This your address info</Text>
      <ConnectWallet />
      {addressInfo &&
      <> 
        <Text>Balance:</Text>
        <Text>{JSON.stringify(addressInfo.addressDetails.amount[0].quantity / 1_000_000)} Ada</Text>
      </>
      }
      <pre style={codeStyle} w="50%">{JSON.stringify(addressInfo, null, 2)}</pre>
    </Box>
  )
}
