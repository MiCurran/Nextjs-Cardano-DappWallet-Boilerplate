import { TransactionUnspentOutput } from "../cardano/custom_modules/@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib";
import { IPFS_GATEWAY } from "./config";
import * as S  from '@emurgo/cardano-serialization-lib-asmjs'
export const ipfsToHttps = (ipfs) =>
  IPFS_GATEWAY + "/" + ipfs.split("ipfs://")[1];

export const toLovelace = (
  ada
)=> {
  if (!ada) return;
  return BigInt(
    parseFloat(ada.toString().replace(/[,\s]/g, ""))
      .toLocaleString("en-EN", { minimumFractionDigits: 6 })
      .replace(/[.,\s]/g, "")
  );
};

export const fromLovelace = (lovelace) =>
  Number(((lovelace) * BigInt(100)) / BigInt(1000000)) / 100;


export const fromLovelaceDisplay = (
  lovelace,
  displayOptions
) =>
  Intl.NumberFormat("en-EN", {
    notation: displayOptions?.compact ? "compact" : "standard",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(fromLovelace(lovelace)) +
  " " +
  "₳";

export const isBrowser = () => typeof window !== "undefined";

export const getCardano = () => {
  const cardano = isBrowser() && window.cardano;
  return cardano;
};

export const getSelectedWallet = async () => {
  const cardano = getCardano();
  await new Promise((res, rej) => setTimeout(() => res(1), 50)); // waiting until wallet is mounted in window object
  const selectedWallet = cardano?.selectedWallet;
  return selectedWallet;
};

export const getAddressBech32 = (addressHex) => {
  console.log(S.Address)
 return S.Address?.from_bytes(Buffer.from(addressHex, "hex")).to_bech32();
}


export const valueToAssets = (value) => {
  const parsedValue = S.Value.from_bytes(Buffer.from(value, "hex"));
  const assets = [];
  assets.push({ unit: "lovelace", quantity: parsedValue.coin().to_str() });
  if (parsedValue.multiasset()) {
    const multiAssets = parsedValue.multiasset().keys();
    for (let j = 0; j < multiAssets.len(); j++) {
      const policy = multiAssets.get(j);
      const policyAssets = parsedValue.multiasset().get(policy);
      const assetNames = policyAssets.keys();
      for (let k = 0; k < assetNames.len(); k++) {
        const policyAsset = assetNames.get(k);
        const quantity = policyAssets.get(policyAsset);
        const asset =
          Buffer.from(policy.to_bytes()).toString("hex") +
          Buffer.from(policyAsset.name()).toString("hex");
        assets.push({
          unit: asset,
          quantity: BigInt(quantity.to_str()),
        });
      }
    }
  }
  return assets;
};

export const assetsToValue = (assets) => {
  const multiAsset = S.MultiAsset.new();
  const lovelace = assets.find((asset) => asset.unit === "lovelace");
  const policies = [
    ...new Set(
      assets
        .filter((asset) => asset.unit !== "lovelace")
        .map((asset) => asset.unit.slice(0, 56))
    ),
  ];
  policies.forEach((policy) => {
    const policyAssets = assets.filter(
      (asset) => asset.unit.slice(0, 56) === policy
    );
    const assetsValue = S.Assets.new();
    policyAssets.forEach((asset) => {
      assetsValue.insert(
        S.AssetName.new(Buffer.from(asset.unit.slice(56), "hex")),
        S.BigNum.from_str(asset.quantity.toString())
      );
    });
    multiAsset.insert(
      S.ScriptHash.from_bytes(Buffer.from(policy, "hex")),
      assetsValue
    );
  });
  const value = S.Value.new(
    S.BigNum.from_str(lovelace ? lovelace.quantity.toString() : "0")
  );
  if (assets.length > 1 || !lovelace) value.set_multiasset(multiAsset);
  return value;
};

export const toHex = (bytes) =>
  Buffer.from(bytes).toString("hex");

export const utxoToCSLFormat = (utxo) => {
  return TransactionUnspentOutput.new(
    S.TransactionInput.new(
      S.TransactionHash.from_bytes(Buffer.from(utxo.txHash, "hex")),
      utxo.outputIndex
    ),
    S.TransactionOutput.new(
      S.Address.from_bech32(utxo.address),
      assetsToValue(utxo.amount)
    )
  );
};