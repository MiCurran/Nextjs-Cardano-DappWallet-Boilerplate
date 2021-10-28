import Address from '../../views/Address/Address';
const axios = require('axios');
import { ADDRESSES } from '../../constants/API/v0/routes';

export default function AddressPage(props) {
  return (
    <Address {...props} />
  )
}

// we can add server side rendering here to seperate from views
export async function getServerSideProps(req) {
    const { address } = req.query 
  async function getAddressInfo() {
    try {
      const response = await axios.get(`${ADDRESSES}/${address}`);
      //console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(error.response);
      return null
    }
  }
  const addressInfo = await getAddressInfo();
      return {
          props: {
              addressInfo: addressInfo,
          }
      };
};
