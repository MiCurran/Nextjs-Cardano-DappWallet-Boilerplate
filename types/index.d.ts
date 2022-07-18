export {};

declare global {
    interface Window {
      cardano: any;
      //TO DO - define the cardano object type
    }
    type UTxO = {
        txHash: string;
        outputIndex: number;
        amount: Asset[];
        address: string;
        datumHash: string;
      }
  }