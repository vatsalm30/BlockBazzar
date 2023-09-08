import {useState, useEffect} from 'react';
import {getListingTokenURI, listingNum} from '../components/Web3Client';
import TitlebarImageList from '../components/ImagePanel';
import { useNavigate } from "react-router-dom";

export const MarketPlacePage = () => {
    const [NFTImageData, setNFTImageData] = useState([]);
    const tokensArray = []
    const navigate = useNavigate();
    const [loadSite, setLoadSite] = useState(false);
    
    useEffect(()=>{
        if (loadSite){
            try{
            listingNum().then((tokenID) =>{
                loopOverTokens(tokenID)
                if (NFTImageData.length !== 0 && NFTImageData.length < tokenID) navigate("/market")
            }).catch((error) => console.log(error))
            }
            catch (err){
                navigate("/market")
            }
        }
    })
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

    function fetchTokenURI(tokenID, done) {
        getListingTokenURI(parseInt(tokenID)).then(async CID => {
            await fetch(CID.replace("ipfs://", "https://").replace("/metadata.json", ".ipfs.dweb.link/metadata.json")).then(async res => {
                const json = await res.json()
                json["tokenId"] = tokenID
                tokensArray.push(json)
                if(done){
                    setNFTImageData([...NFTImageData, ...tokensArray])
                }
                
            })
            }).catch(error => {
            console.error(error)
        });
    }

    async function loopOverTokens(tokenID){
        for(let i = 1; i<= tokenID; i++){
            await fetchTokenURI(i, i==tokenID && NFTImageData.length == 0);
        }
    }

    const ListingRedirect = () => {
        navigate("/listing");
    }
    const HomeRedirect = () => {
        navigate("/");
    }
        
    const ProfilePageRedirect = () => {
        navigate("/profile");
    }

  return (
    <div>
        <button onClick={()=>HomeRedirect()} className="cta-button">Home</button>
        <button onClick={()=>ListingRedirect()} className="cta-button">ListingPage</button>
        <button onClick={() => ProfilePageRedirect()} className="cta-button">Profile</button>
        <TitlebarImageList images={NFTImageData} onIMGClick="/market/product/"/>
    </div>
  )
}
