import Home from '../views/Home/Home';
const axios = require('axios');
import { LATEST_BLOCK } from '../constants/API/V0/routes';

export default function HomePage(props) {
  return (
    <Home {...props} />
  )
}

// we can add server side rendering here to seperate from views
export async function getServerSideProps() {
  async function getLatestBlock() {
    try {
      const response = await axios.get(LATEST_BLOCK);
      return response.data.latestBlock;
    } catch (error) {
      console.error(error);
    }
  }
  const latestBlock = await getLatestBlock();
      return {
          props: {
              latestBlock,
          }
      };
};
