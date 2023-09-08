import Web3 from "web3";
import SaleTokenContract from "contracts/SaleTokens.json"
import MarketContract from "contracts/Market.json"


let selectedAccount;
let SaleTokenAddress;
let SaleToken;
let Market;
let MarketAddress;
export const init = async () => {
    let provider = window.ethereum;

    if(typeof provider !== 'undefined'){
      //metamask is installed

      provider.request({method: "eth_requestAccounts"})
      .then(accounts => {
        selectedAccount = accounts[0]
        // console.log(`Selected account is ${selectedAccount}`);
      })
      .catch(err => {
        console.log(err);
      })
      window.ethereum.on('accountsChanged', function(accounts){
        selectedAccount = accounts[0]
        // console.log(`Selected changed to ${selectedAccount}`);
      })
    }

    const web3 = new Web3(provider);

    const networkId = await web3.eth.net.getId();
    SaleTokenAddress = SaleTokenContract.networks[networkId].address
    MarketAddress = MarketContract.networks[networkId].address
    SaleToken = new web3.eth.Contract(SaleTokenContract.abi, SaleTokenAddress)
    Market = new web3.eth.Contract(MarketContract.abi, MarketAddress)
};

export const mintItems = (itemNum, tokenURI) => {
    return SaleToken.methods.mintItems(itemNum, tokenURI).send({ from: selectedAccount });
}

export const editToken = (tokenNumber, tokenURI) => {
  return SaleToken.methods.mintItems(tokenNumber, tokenURI).send({from: selectedAccount })
}

export const approve = (doAllow) => {
  return SaleToken.methods.setApprovalForAll(MarketAddress, doAllow).send({ from: selectedAccount });
}
export const getTokenURI = (tokenID) => {
  return SaleToken.methods.uri(tokenID).call();
}
export const getTokenCounter = () => {
    return SaleToken.methods.getLastTokenId().call();
}
export const getItemMinter = (tokenID) => {
    return SaleToken.methods.getMinter(tokenID).call();
}

export const editProductToken = (tokenID, newURI) => {
  return SaleToken.methods.editToken(tokenID, newURI).send({ from: selectedAccount });
}

export const listingNum = () =>{
  return Market.methods.getNumOfListings().call();
}

export const listingPrice = (_listingId) =>{
  return Market.methods.getTokenPrice(_listingId).call();
}

export const listingStock = (_listingId) =>{
  return Market.methods.getTokenStock(_listingId).call();
}

export const listingSearchTerms = (_listingId) =>{
  return Market.methods.getTokenSearchTerms(_listingId).call();
}

export const getListingTokenURI = (_listingId) =>{
  return Market.methods.getListingTokenURI(_listingId).call();
}

export const getListingTokenId = (_listingId) =>{
  return Market.methods.getTokenId(_listingId).call();
}

export const getListingTokenSeller = (_listingId) =>{
  return Market.methods.getTokenSeller(_listingId).call();
}

export const listToken = (tokenID, price, stock, searchTerms) => {
    return Market.methods.listEditProduct(tokenID, stock, price, SaleTokenAddress, searchTerms, 0).send({ from: selectedAccount });
}

export const editListedToken = (tokenID, price, stock, searchTerms, tokenToEdit) => {
  return Market.methods.listEditProduct(tokenID, stock, price, SaleTokenAddress, searchTerms, tokenToEdit).send({ from: selectedAccount });
}

export const buyToken = (listingID, amountToBuy, amountToPay) => {
  return Market.methods.buyProduct(listingID, amountToBuy).send({ from: selectedAccount, value: amountToPay });
}
