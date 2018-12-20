const {Blockchain, Transaction} = require('./blockchain');
const EC = require ('elliptic').ec;

const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('bf175e2424263ca7c38163084eac966b59e7c5afeed4b1945c8e2d1aca7e5aff');
const myWalletAddress = myKey.getPublic('hex');

let selfCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, '>Public Key Goes Here<', 30);
tx1.signTransaction(myKey);
selfCoin.addTransaction(tx1);

console.log("Is chain valid?", selfCoin.isChainValid());
console.log('\n Starting miner..');
selfCoin.minePendingTransactions(myWalletAddress);

console.log('\n Balance of nathan is:', selfCoin.getBalanceOfAddress(myWalletAddress));

console.log("Is chain valid?", selfCoin.isChainValid());