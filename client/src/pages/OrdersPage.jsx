import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getTokenURI, getTokenCounter, getItemMinter, balanceOfFromAddress} from '../components/Web3Client';
import TitlebarImageList from '../components/ImagePanel';

export const OrdersPage = () => {


  const navigate = useNavigate()
  const [account, setAccount] = useState(false)
  const [NFTImageData, setNFTImageData] = useState([]);
  const tokensArray = []
  const [loadSite, setLoadSite] = useState(false);

  useEffect(() => {
    if(loadSite){
      if (typeof window.ethereum !== 'undefined') {
        // Request the user's accounts from MetaMask
        window.ethereum.request({ method: 'eth_accounts' })
          .then(async (result) => {
            setAccount(result[0])
            getTokenCounter().then(tokenCounter => {
              loopOverTokens(tokenCounter)
            })
          })
          .catch((error) => {
            console.error('Error retrieving accounts:', error);
          });
      } else {
        console.error('MetaMask is not installed');
      }
    }
  });
  
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

  useEffect(()=>{
    if(typeof window.ethereum != "undefined"){
        window.ethereum.on('accountsChanged', function(){
            navigate("/profile/")
          })
    }
  })

  const GetTokenURI = (tokenID) => {
    return getTokenURI(tokenID)
  }    

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
        console.log(error)
    });
}

async function loopOverTokens(tokenID){

  for(let i = 1; i <= tokenID; i++) {
    balanceOfFromAddress(account, i).then((balance) => {
      getItemMinter(i).then(Owner => {
        console.log(window.BigInt(account) != window.BigInt(Owner))
        if(balance >= 1n && window.BigInt(account) != window.BigInt(Owner))
        {
          fetchTokenURI(i, NFTImageData.length == 0);
        }
      })
    }).catch(error => {console.log(error)});
    }
  }

  const BackRedirect = () => {
    navigate("/profile");
  } 

  return (
    <div>
      <header>
        <button onClick={() => BackRedirect()} className="cta-button">Back</button>
        <TitlebarImageList images={NFTImageData} onIMGClick=""/>
      </header>
    </div>
  )
}
