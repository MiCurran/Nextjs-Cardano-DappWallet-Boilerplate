import '../styles/globals.scss'
import { ChakraProvider} from "@chakra-ui/react"
import { theme } from '../constants/theme';
import { StoreProvider } from 'easy-peasy';
import store from '../store/store';

function App({ Component, pageProps }) {
  return (
    <StoreProvider store={store}>
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    </StoreProvider>
  )
}

export default App;
