import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {getListingTokenURI, getListingTokenSeller, getListingTokenId, buyToken, listingPrice, listingStock} from '../components/Web3Client'
import TitlebarImageList from '../components/ImagePanel';
import Web3 from "web3"

export const OrdersPage = () => {


  const navigate = useNavigate()
  const [loadSite, setLoadSite] = useState(false)
  const [account, setAccount] = useState(false)
  // const [loadSite, setLoadSite] = useState(false)

  useEffect(() => {
    const onPageLoad = () => {
      setLoadSite(true);
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      // Request the user's accounts from MetaMask
      const web3 = new Web3(window.ethereum);
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (result) => {
          setAccount(result[0]);
          if(loadSite){
            // token finding logic goes here
          }
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
            navigate("/profile")
          })
    }
  })


  const BackRedirect = () => {
    navigate("/profile");
  } 

  return (
    <div>
      <header>
        <button onClick={() => BackRedirect()} className="cta-button">Back</button>
      </header>
    </div>
  )
}
