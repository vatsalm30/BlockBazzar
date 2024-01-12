import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import TitlebarImageList from '../components/ImagePanel';
import {getTokenURI, getTokenCounter, getItemMinter} from '../components/Web3Client';
import {NFTStorage} from 'nft.storage'

const ProfilePage = () => {
  const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEYyODM3YUM2MjJDYTk1NTBEQzBmODM0MWE5OGZGNkIzQUYwMWM3ODMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NTAwOTUzNTI0MywibmFtZSI6IlZhbWF6b24gSXBmcyBlbmNvZGluZyJ9.ry07HwNtVi4ciXthBL9HZgcr1kLaRy7PesrRfLeS0BI"

    const [account, setAccount] = useState()
    const [balance, setBalance] = useState()
    const [NFTImageData, setNFTImageData] = useState([]);
    const[userName, setUserName] = useState('Unnamed');
    const[profilePhoto, setProfilePhoto] = useState();

    const[uploadImage, setUploadImage] = useState();

    const tokensArray = []

    const navigate = useNavigate();
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
          // Request the user's accounts from MetaMask
          const web3 = new Web3(window.ethereum);
          window.ethereum.request({ method: 'eth_accounts' })
            .then(async (result) => {
              setAccount(result[0]);
              fetchUserData(result[0]);
              console.log(result[0]);
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

    const fetchUserData = (_idAddress) => {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8080/retriveUserData", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onload = () => {
          console.log(xhr.responseText);
          try{
            const userData = JSON.parse(xhr.responseText);
            setUserName(userData["username"]);
            setProfilePhoto(userData["pfp"].replace("ipfs://", "https://") + ".ipfs.dweb.link/");
          }
          catch{
          }
        }
      xhr.send(JSON.stringify({"_id": _idAddress}));
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

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }


  const onGetImage = (e) => {
    if(e.target.files?.length === 0) {console.log("DEBUG"); setUploadImage(undefined);}
    if(e.target.files && e.target.files?.length !== 0){
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        var reader = new FileReader();
        reader.onload = function(event) {
          if(event.target){
            var imageBlob = dataURItoBlob(event.target.result?.toString() || "");
            setUploadImage(imageBlob);
          }
        };
        reader.readAsDataURL(selectedFile);
        }
      }
    }

    const storeOnIPFS = (_image) => {
      const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
      return nftstorage.storeBlob(_image).then(nftIPFs => {
        console.log("ipfs://" + nftIPFs);
        return "ipfs://" + nftIPFs
      })
    }

  const submitHandler = (e) => {
    e.preventDefault();
    var xhr = new XMLHttpRequest();
    const target = e.target;
    xhr.open("POST", "http://localhost:8080/userposter", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    xhr.onload = () => {
        console.log(xhr.responseText);
    }
    let dataSend = {
          '_id': account,
          'username': target[0].value !== "" ? target[0].value : "",
          'address': target[1].value !== "" ? target[1].value : "",
          'pfp': ""
          }
    if(uploadImage) storeOnIPFS(uploadImage).then(imageIPFS => {
      console.log(imageIPFS)
      dataSend['pfp'] = imageIPFS
      xhr.send(JSON.stringify(dataSend));
      window.location.reload();
    }).catch( (err) => {
      console.log(err);
      window.location.reload();
    })
    if(!uploadImage) {xhr.send(JSON.stringify(dataSend)); window.location.reload();}
  }

  return (
    <div>
        <h1>{userName}</h1>
        <h3>Account: {account}</h3>
        <h3>Ethereum: {balance}</h3>
        <button onClick={()=>HomeRedirect()} className="cta-button">Home</button>
        <button onClick={()=>ListingRedirect()} className="cta-button">ListingPage</button>
        <button onClick={() => MarketPlaceRedirect()} className="cta-button">Market Place</button>
        <button onClick={() => OrdersPageRedurect()} className="cta-button">Orders</button>
        <TitlebarImageList images={NFTImageData} onIMGClick="/product/"/><br/><br/>
        <form onSubmit={submitHandler}>
          <input type='text' className='cta-text' placeholder='username'/><br/>
          <input type='text' className='cta-text' placeholder='address'/><br/>
          <input type='file' className='cta-file' placeholder='pfp' onChange={onGetImage}/><br/>
          <input type='submit' className='cta-button'/><br/><br/>
        </form>
        {profilePhoto && <img src={profilePhoto} alt="profile"/>}
        <h3>{userName}</h3>
    </div>
  )
} 

export default ProfilePage