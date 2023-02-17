const contractAddress = '0x123...'; // Replace with your smart contract address

const contractABI = [

  Marketplace.abi.json

];

const kit = ContractKit.newKit('https://forno.celo.org'); // Use the Celo forno testnet

const stableTokenContractAddress = '0x765DE816845861e75A25fCA122bb6898B8B1282a'; // Replace with the address of the cUSD stablecoin

const stableTokenContractABI = [

  // Replace with the ABI for the cUSD stablecoin

];

async function getNFTsForSale() {

  const contract = new kit.web3.eth.Contract(contractABI, contractAddress);

  const nftCount = await contract.methods.getNFTCount().call();

  const nftList = document.getElementById('nftList');

  for (let i = 0; i < nftCount; i++) {

    const nft = await contract.methods.getNFT(i).call();

    const listItem = document.createElement('li');

    listItem.innerHTML = `

      <strong>${nft.name}</strong><br>

      ${nft.description}<br>

      Price: ${nft.price} cUSD<br>

      <button type="button" onclick="purchaseNFT(${i})">Purchase</button>

    `;

    nftList.appendChild(listItem);

  }

}

async function createNFT() {

  const name = document.getElementById('name').value;

  const description = document.getElementById('description').value;

  const price = document.getElementById('price').value;

  const contract = new kit.web3.eth.Contract(contractABI, contractAddress);

  const accounts = await kit.web3.eth.getAccounts();

  const account = accounts[0];

  const result = await contract.methods.createNFT(name, description, price).send({ from: account });

  console.log(result);

}

async function purchaseNFT(nftId) {

  const contract = new kit.web3.eth.Contract(contractABI, contractAddress);

  const nft = await contract.methods.getNFT(nftId).call();

  const price = nft.price;

  const seller = nft.owner;

  const stableTokenContract = new kit.web3.eth.Contract(stableTokenContractABI, stableTokenContractAddress);

  const accounts = await kit.web3.eth.getAccounts();

  const account = accounts[0];

  const balance = await stableTokenContract.methods.balanceOf(account).call();

  if (balance < price) {

    alert("You don't have enough cUSD to purchase this NFT.");

    return;

  }

  const result = await contract.methods.purchaseNFT(nftId).send({ from: account, value: price });

  console.log(result);

}

async function withdrawFunds() {

  const contract = new kit.web3.eth.Contract(contractABI, contractAddress);

  const accounts = await kit.web3.eth.getAccounts();

  const account = accounts[0];

  const result = await contract.methods.withdrawFunds().send({ from: account });

  console.log(result);

}

document.getElementById('createNFTButton').addEventListener('click', createNFT);

document.getElementById('purchaseNFTButton').addEventListener('click', function(event) {

  event.preventDefault();

  purchaseNFT(document.getElementById('nftId').value);

});

document.getElementById('withdrawFundsButton').addEventListener('click', function(event) {

  event.preventDefault();

  withdrawFunds(document.getElementById('sellerAddress').value);

});

getNFTsForSale();

