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

const network = new NET.StacksMainnet();

const callSendToProxy = async () => {
  let nonce = await getNonce();

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: FUNCTION_NAME,
    functionArgs: [],
    senderKey: PRIVATE_KEY,
    nonce: new BN(nonce),
    fee: new BN(3000, 10),
    postConditionMode: 2,
    network
  };

  const transaction = await TX.makeContractCall(options);
  const result = TX.broadcastTransaction(transaction, network);

  console.log("[UWU Keeper] Transaction submitted:");
  console.log(`[>] ID: ${transaction.txid()}`);
  console.log(`[>] SENDER: ${PUBLIC_KEY}`);
  console.log(`[>] FEE: ${new BN(3000, 10)}`);
  console.log(`[>] NONCE: ${new BN(nonce)}`);
};

async function getNonce() {
  const url = `https://stacks-node-api.mainnet.stacks.co/extended/v1/address/${PUBLIC_KEY}/nonces`;
  const result = await REQUEST(url, { json: true });

  return result["possible_next_nonce"];
};

callSendToProxy();
