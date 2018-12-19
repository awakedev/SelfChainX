const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, prevHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.prevHash +
                this.timestamp + JSON.stringify(this.data) + this.nonce)
            .toString();

    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.calculateHash();

        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenBlock()];
        this.difficulty = 5;
    }

    createGenBlock() {
        return new Block(0, "19/12/2018", "Genesis Block", "no");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];

    }

    addBlock(newBlock) {

        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return ("Blockchain tampered with : " + false);
            }
            if (currentBlock.prevHash !== previousBlock.hash) {
                return ("Blockchain tampered with : " + false);
            }
        }
        return true;
    }
}



let selfCoin = new Blockchain();

console.log("Mining block 1..")
selfCoin.addBlock(new Block(1, "18/12/2018", {
    mood: "Happy"
}));

console.log("Mining block 2..")
selfCoin.addBlock(new Block(2, "19/12/2018", {
    mood: "Motivated"
}));

