const { generateDataCircom } = require("../scripts/index");
const { bigintToUint8ArrayBitwise } = require("../scripts/common/index");
const { ANVIL_ADDRESSES, ANVIL_PRIVATE_KEYS } = require("../scripts/common/anvil_accounts_data.json");
const path = require("path");
const snarkjs = require("snarkjs");
const fs = require("fs");

// Constants
const ZKEY_FILE_PATH = path.join(__dirname, "../build", "SAM-ECDSA.zkey");
const WASM_PATH = path.join(__dirname, "../build/SAM-ECDSA_js", "SAM-ECDSA.wasm");
const VERIFICATION_FILE_PATH = path.join(__dirname, "../build", "verification_key.json");

const TREE_HIGHT = 5;
const DEFAULT_MSG_HASH = "0x104ffbad9450b48089e3d917b63fc13c88ddac7ed4a02bc03512d883f0666c8b";



(async function () {
let defaultUserPrivateKey = bigintToUint8ArrayBitwise(BigInt(ANVIL_PRIVATE_KEYS[0]));


let defaultWitnessData = await generateDataCircom(
  defaultUserPrivateKey,
  ANVIL_ADDRESSES,
  DEFAULT_MSG_HASH,
  TREE_HIGHT,
);

const { proof, publicSignals } = await snarkjs.groth16.fullProve(defaultWitnessData, WASM_PATH, ZKEY_FILE_PATH);

console.log("Proof: ");
console.log(JSON.stringify(proof, null, 1));

console.log("Pub Signals: ");
console.log(publicSignals)


const vKey = JSON.parse(fs.readFileSync(VERIFICATION_FILE_PATH));

const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

if (res === true) {
    console.log("Verification OK");
} else {
    console.log("Invalid proof");
}

process.exit()

})();
