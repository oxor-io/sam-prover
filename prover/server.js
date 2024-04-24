const express = require('express')
var bodyParser = require('body-parser')

const path = require("path");
const snarkjs = require("snarkjs");

const app = express()
const port = process.env.PORT || 3000;


// Constants
const ZKEY_FILE_PATH = path.join(__dirname, "../build", "SAM-ECDSA.zkey");
const WASM_PATH = path.join(__dirname, "../build/SAM-ECDSA_js", "SAM-ECDSA.wasm");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post('/prove', async function (req, res) {
  witnessData = req.body
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(witnessData, WASM_PATH, ZKEY_FILE_PATH);

  proof.commit = publicSignals[0]

  res.send(proof);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})