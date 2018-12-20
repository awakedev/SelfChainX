const SHA256 = require('crypto-js/sha256');

class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor(timestamp, transactions, prevHash = '') {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.prevHash = prevHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}

	mineBlock(difficulty) {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log('Block mined: ' + this.hash);
	}
}

class Blockchain {
	constructor() {
		this.chain = [ this.createGenBlock() ];
		this.difficulty = 3;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenBlock() {
		return new Block('19/12/2018', 'Genesis Block', 'no');
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress) {
		let block = new Block(Date.now(), this.pendingTransactions);
		block.mineBlock(this.difficulty);

		console.log('Block mined successfully !');
		this.chain.push(block);

		this.pendingTransactions = [ new Transaction(null, miningRewardAddress, this.miningReward) ];
	}

	createTransaction(transaction) {
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address) {
		let balance = 0;

		for (const block of this.chain) {
			for (const trans of block.transactions) {
				if (trans.fromAddress === address) {
					balance -= trans.amount;
				}

				if (trans.toAddress === address) {
					balance += trans.amount;
				}
			}
		}
		return balance;
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return 'Blockchain tampered with : ' + false;
			}
			if (currentBlock.prevHash !== previousBlock.hash) {
				return 'Blockchain tampered with : ' + false;
			}
		}
		return true;
	}
}

let selfCoin = new Blockchain();

selfCoin.createTransaction(new Transaction('address1', 'address2', 300));
selfCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting miner..');
selfCoin.minePendingTransactions('nathans-address');

console.log('\n Balance of nathan is', selfCoin.getBalanceOfAddress('nathans-address'));
