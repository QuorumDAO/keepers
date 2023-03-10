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
    nonce: new BN(nonce + 1),
    fee: new BN(10000, 10),
    postConditionMode: 1,
    NETWORK
  };

  const transaction = await TX.makeContractCall(txOptions);
  const result = TX.broadcastTransaction(transaction, NETWORK);

  await processing(result, transaction.txid(), 0);
};

async function getNonce() {
  const url = `https://stacks-node-api.mainnet.stacks.co/v2/accounts/${PUBLIC_KEY}?proof=0`;
  const result = await REQUEST(url, { json: true });

  return result.nonce;
}

async function processing(broadcastedResult, tx, count) {
  const url = `https://stacks-node-api.mainnet.stacks.co/v2/accounts/extended/v1/tx/${tx}`;
  var result = await fetch(url);
  var value = await result.json();

  console.log(`[UWU Keeper] Count: ${count}`);
  
  if (value.tx_status === "success") {
    console.log(`[UWU Keeper] Transaction processed: ${tx}`);
    console.log(value);
    
    return true;
  };

  if (value.tx_status === "pending") {
    console.log(value);
  } else if (count === 3) {
    console.log(value, broadcastedResult);
  };

  if (count > 20) {
    console.log("[UWU Keeper] Transaction failed after 10 tries");
    console.log(value);

    return false;
  };

  setTimeout(function () {
    return processing(broadcastedResult, tx, count + 1);
  }, 3000);
};