require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

const CONTRACT_ADDRESS = "SP2AKWJYC7BNY18W1XXKPGP0YVEK63QJG4793Z2D4";
const CONTRACT_NAME = "uwu-oracle-v1";
const FUNCTION_NAME = "send-to-proxy";

const BN = require("bn.js");
const REQUEST = require("request-promise");
const TX = require("@stacks/transactions");
const NET = require("@stacks/network");

const NETWORK = new NET.StacksMainnet();

const updatePrice = async () => {
  let nonce = await getNonce();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: FUNCTION_NAME,
    functionArgs: [],
    senderKey: PRIVATE_KEY,
    nonce: new BN(nonce),
    fee: new BN(3000, 10),
    postConditionMode: 0,
    NETWORK
  };

  const transaction = await TX.makeContractCall(txOptions);
  const result = TX.broadcastTransaction(transaction, NETWORK);

  await getTx(result, transaction.txid(), 0);
};

async function getNonce() {
  const url = `https://stacks-node-api.mainnet.stacks.co/extended/v1/address/${PUBLIC_KEY}/nonces`;
  const result = await REQUEST(url, { json: true });

  return result["possible_next_nonce"];
}

async function getTx(broadcastedResult, tx, count) {
  const url = `https://stacks-node-api.mainnet.stacks.co/extended/v1/tx/${tx}`;
  var result = await fetch(url);
  var value = await result.json();

  console.log(`[UWU Keeper] Transaction submitted:`);
  console.log(value);
};

updatePrice();
