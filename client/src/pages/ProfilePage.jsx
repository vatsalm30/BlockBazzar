import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import TitlebarImageList from '../components/ImagePanel';
import {getTokenURI, getTokenCounter, getItemMinter} from '../components/Web3Client';

const ProfilePage = () => {

    const [account, setAccount] = useState()
    const [balance, setBalance] = useState()
    const [NFTImageData, setNFTImageData] = useState([]);
    const tokensArray = []

    const navigate = useNavigate();
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
          // Request the user's accounts from MetaMask
          const web3 = new Web3(window.ethereum);
          window.ethereum.request({ method: 'eth_accounts' })
            .then(async (result) => {
              setAccount(result[0]);
                try{
                    getTokenCounter().then((tokenID) =>{
                        loopOverTokens(tokenID, result[0])
                    }).catch((error) => console.log(error))
                    }
                    catch (err){
                        navigate("/profile")
                    }
              
              const weiBalance = await web3.eth.getBalance(result[0]);
              const ethBalance = web3.utils.fromWei(weiBalance, 'ether');    
              setBalance(ethBalance)
            })
            .catch((error) => {
              console.error('Error retrieving accounts:', error);
            });
        } else {
          console.error('MetaMask is not installed');
        }
      });
      
      useEffect(()=>{
        if(typeof window.ethereum != "undefined"){
            window.ethereum.on('accountsChanged', function(){
                navigate("/")
                setNFTImageData([])
                navigate("/profile")
              })
        }
      })

      function fetchTokenURI(tokenID, done) {
        GetTokenURI(parseInt(tokenID)).then(async CID => {
            await fetch(CID.replace("ipfs://", "https://").replace("/metadata.json", ".ipfs.dweb.link/metadata.json")).then(async res => {
                const json = await res.json()
                tokensArray.push(json)
                if(done){
                    setNFTImageData([...NFTImageData, ...tokensArray])
                }
                
            })
            }).catch(error => {
            console.error(error)
        });
    }

    async function loopOverTokens(tokenID, Account){
        for(let i = 1; i<= tokenID; i++){
            GetNFTMinter(i).then(async (Owner)=>{
                if (window.BigInt(Account) == window.BigInt(Owner))            
                    fetchTokenURI(i, NFTImageData.length == 0);
            }
            )

        }
    }

    const GetTokenURI = (tokenID) => {
        return getTokenURI(tokenID)
    }    
    const GetNFTMinter = (tokenID) => {
        return getItemMinter(tokenID)
    }

    const ListingRedirect = () => {
        navigate("/listing");
    }
    const HomeRedirect = () => {
        navigate("/");
    }
        
    const MarketPlaceRedirect = () => {
        navigate("/market");
    }

    const OrdersPageRedurect = () => {
      navigate("/profile/orders");
  }

  return (
    <div>
        <h1>Profile</h1>
        <h3>Account: {account}</h3>
        <h3>Ethereum: {balance}</h3>
        <button onClick={()=>HomeRedirect()} className="cta-button">Home</button>
        <button onClick={()=>ListingRedirect()} className="cta-button">ListingPage</button>
        <button onClick={() => MarketPlaceRedirect()} className="cta-button">Market Place</button>
        <button onClick={() => OrdersPageRedurect()} className="cta-button">Orders</button>
        <TitlebarImageList images={NFTImageData} onIMGClick="/product/"/>
    </div>
  )
}

export default ProfilePage