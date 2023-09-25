import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {getTokenURI, approve, listToken, getItemMinter, listingNum, getListingTokenId, listingPrice, listingStock, editListedToken, listingSearchTerms, editProductToken} from '../components/Web3Client'
import Web3 from "web3";
import Decimal from 'decimal.js';
import {NFTStorage} from 'nft.storage'

export const ProductPage = () => {
  const navigate = useNavigate()
  const {id} = useParams()

  const [image, setImage] = useState()
  const [name, setName] = useState("")
  const [descr, setDescr] = useState("")
  const [loadSite, setLoadSite] = useState(false)
  const [isMinter, setIsMinter] = useState(false)
  const[price, setPrice] = useState(window.BigInt(0))
  const[stock, setStock] = useState(0)
  const [inputs, setInputs] = useState([])
  const [deployedListing, setDeployedListing] = useState(0)
  const [newName, setNewName] = useState("")
  const [newDescr, setNewDescr] = useState("")
  const [newImage, setNewImage] = useState(new Blob())
  const [imageChanged, setImageChanged] = useState(false)


  const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEYyODM3YUM2MjJDYTk1NTBEQzBmODM0MWE5OGZGNkIzQUYwMWM3ODMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NTAwOTUzNTI0MywibmFtZSI6IlZhbWF6b24gSXBmcyBlbmNvZGluZyJ9.ry07HwNtVi4ciXthBL9HZgcr1kLaRy7PesrRfLeS0BI";

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

  // useEffect(()=>{
  //   if(loadSite){
  //     try{
  //       fetchTokenURI(id)

  //     }
  //     catch (err){
  //         navigate("/product/"+id)
  //     }
  //   }

  //   })


    useEffect(() => {
      if(loadSite){
        try{
          fetchTokenURI(id)
          listingNum().then(numOfListings => {
            for(let i = 1; i <= numOfListings; i++){
              getListingTokenId(i).then(listingToken =>{
                if(listingToken === id) {
                  setDeployedListing(i)
                  listingPrice(i).then(res =>{
                    const priceNum = new Decimal(res.toString())
                    const divisorNum = new Decimal(1e18)
                    setPrice(priceNum.dividedBy(divisorNum))
                  })
                  listingStock(i).then(res =>{
                    setStock(res)
                  })

                  listingSearchTerms(i).then(res =>{
                    setInputs(res)
                  })
                }
              })
            }
          })
        setLoadSite(false)
        }
        catch (err){
            navigate("/product/"+id)
        }
      }

      if (typeof window.ethereum !== 'undefined') {
        // Request the user's accounts from MetaMask
        const web3 = new Web3(window.ethereum);
        window.ethereum.request({ method: 'eth_accounts' })
          .then(async (result) => {
            if(loadSite){
              try{
                getItemMinter(id).then(minter=>{
                  setIsMinter(window.BigInt(minter)==window.BigInt(result[0]))
                  if (window.BigInt(minter) !== window.BigInt(result[0])){
                    // add user verification warning here later
                    navigate("/")
                  }
                })
                  }
                  catch (err){
                      navigate("/product/"+id)
                  }
            }
          })
          .catch((error) => {
            console.error('Error retrieving accounts:', error);
          });

          if(typeof window.ethereum != "undefined"){
            window.ethereum.on('accountsChanged', function(){
                navigate("/")
                navigate("/product/"+id)
              })
        }
          
      } else {
        console.error('MetaMask is not installed');
      }
    });

    // useEffect(()=>{
    //   if(typeof window.ethereum != "undefined"){
    //       window.ethereum.on('accountsChanged', function(){
    //           navigate("/")
    //           navigate("/product/"+id)
    //         })
    //   }
    // })
  

    const addInput = () => {
      setInputs([...inputs, '']);
    };
  
    const handleInputChange = (index, event) => {
      const newInputs = [...inputs];
      newInputs[index] = event.target.value;
      setInputs(newInputs);
    };

    const removeInput = () => {
      const inputsList = [...inputs];
      inputsList.pop();
      setInputs(inputsList);
    }

  function fetchTokenURI(tokenID) {
      getTokenURI(parseInt(tokenID)).then(async CID => {
          await fetch(CID.replace("ipfs://", "https://").replace("/metadata.json", ".ipfs.dweb.link/metadata.json")).then(async res => {
              const json = await res.json()
              setImage(json["image"].replace("ipfs://", "https://").replace("/blob", ".ipfs.dweb.link/blob"))
              setName(json["name"])
              setDescr(json["description"])
              setNewName(json["name"])
              setNewDescr(json["description"])
          })
          }).catch(error => {
          console.error(error)
      });
  }

  const changePrice = (e) =>{
    setPrice(e.target.value)
  }

  const changeStock= (e) =>{
    setStock(e.target.value)
  }


  const changeName = (e) =>{
    setNewName(e.target.value)
  }

  const changeDescr = (e) =>{
    setNewDescr(e.target.value)
  }

  const changeImage = (e) =>{
    const selectedFile = e.target.files[0];
        if (selectedFile) {
          var reader = new FileReader();
          reader.onload = function(event) {
              var imageBlob = dataURItoBlob(event.target.result);
              setNewImage(imageBlob);
          };
          reader.readAsDataURL(selectedFile);
        }
      setImageChanged(true);
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

  const MarketPlaceRedirect = () => {
    navigate("/market");
  }

  const ListedRedirect = () => {
    navigate("/market/product/"+deployedListing);
  }
  
  const EditProductToken = (tokenID, newURI) => {
    editProductToken(tokenID, newURI).then(txn => {
      console.log(txn)
      navigate("/")
      navigate("/product/"+id)
    }).catch(err => console.log(err))
  }

  function handelSubmit(e){
    e.preventDefault()
    approve(true).then(() => {
      listToken(id, window.BigInt(price * 1e18), stock, inputs).catch(err => console.log(err))
      approve(false).then(()=>{
        navigate("/")
        navigate("/product/" + id)
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
    
  }
  
  function handelEditSubmit(e){
    e.preventDefault()
    approve(true).then(() => {
      editListedToken(id, window.BigInt(price * 1e18), stock, inputs, id).catch(err => console.log(err))
      approve(false).then(()=>{
        navigate("/")
        navigate("/product/" + id)
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
    
  }

  function handelNameEdit(e) {
    e.preventDefault()
    getListingTokenId(id).then(listingToken => {
      if(!imageChanged){
        fetch(image).then((response) => response.blob()).then((img) => {

          storeProduct(img, newName, newDescr, Number(listingToken)).then(res => {
            console.log(res.url)
            EditProductToken(listingToken, res.url)
          })
          
        })

      }
      else{
        storeProduct(newImage, newName, newDescr, Number(listingToken)).then(res => {
          console.log(res.url)
          EditProductToken(listingToken, res.url)
        })
      }
    })
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

  async function storeProduct(_image, _name, _description, _tokenId) {
    // load the file from disk
    // const image = await fileFromPath(imagePath)

    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
    
    // call client.store, passing in the image & metadata

    return nftstorage.store({
      name: _name,
      image: _image,
      description: _description,
      tokenId: _tokenId
    }).then(nftIPFS => {
        console.log(nftIPFS.url)
        return nftIPFS;
      })
    .catch(error => console.error(error));
}

  return (
    <div>
      <h1>{name}</h1>
      <h4>{descr}</h4>
      <img
            src={`${image}?w=248&fit=crop&auto=format`}
            srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={"Ha"}
            loading="lazy"
            className='cta-image'
            draggable="false"
            style={{height:"40%", width:"40%"}}
      />
      {(deployedListing != 0) ?(
        <div>
      <h1></h1>
      <button className="cta-button" onClick={()=>ListedRedirect()}>View Deployed Listing</button>
      </div>):(
      <div></div>
      )
    }
      {isMinter && deployedListing == 0 ?(        
        <form onSubmit={handelSubmit}>
          <label>List Product: </label>
          <br></br>
          <label>Price (In Ethereum): </label>
          <input type='text' className='cta-text' onChange={changePrice}/>
          <br></br>
          <label>Stock: </label>
          <input type='number' className='cta-text' onChange={changeStock}/>
          <br></br>
          <label>Search Optimization: </label>
          <div>
          <input type='button' onClick={addInput} value="Add Search Input" className="cta-button"/>
          {inputs.map((value, index) => (
            <input
              key={index}
              value={value}
              onChange={(event) => handleInputChange(index, event)}
              className='cta-text'
            />
          ))}
            {inputs.length > 0 ? (
              <input type='button' onClick={removeInput} value="Remove" className='cta-button'/>
            ):(
              <div></div>
            )}
         </div>
          <br></br>
          <input type='submit' value='List Product' className='cta-button'/>
        </form>):(
                <div>
                  {isMinter && deployedListing != 0 ?(        
                    <form onSubmit={handelEditSubmit}>
                      <label>Edit Product: </label>
                      <br></br>
                      <label>Price (New Price In Ethereum):</label>
                      <input type='text' className='cta-text' placeholder={price.toString()} onChange={changePrice}/>
                      <br></br>
                      <label>New Stock: </label>
                      <input type='number' className='cta-text' placeholder={stock.toString()} onChange={changeStock}/>
                      <br></br>
                      <label>Search Optimization: </label>
                      <div>
                      <input type='button' onClick={addInput} value="Add Search Input" className="cta-button"/>
                      {inputs.map((value, index) => (
                        <input
                          key={index}
                          placeholder={value}
                          onChange={(event) => handleInputChange(index, event)}
                          className='cta-text'
                        />
                      ))}
                      {inputs.length > 0 ? (
                        <input type='button' onClick={removeInput} value="Remove" className='cta-button'/>
                      ):(
                        <div></div>
                      )}
                      
                    </div>
            <input type='submit' value='Edit Product' className='cta-button'/>
          </form>):(
          <br></br>
          )}
          </div>
        )}

        <form onSubmit={handelNameEdit}>
          Edit Photo Name or Description:
          <br></br>
          <label for="text" className="cta-label">New Photo</label>
          <input type='file' className="cta-file" onChange={changeImage} />
          <br></br>
          <label for="text" className="cta-label">New Name</label>
          <input type='text' placeholder={name} onChange={changeName} className="cta-text"/>

          <br></br>
          <label for="text" className="cta-label">New Description</label>
          <input type='text' placeholder={descr} onChange={changeDescr} className="cta-text"/>

          <br></br>
          <input type='Submit' value="Edit Product Core" className = "cta-button"/>
        </form>

      <br></br>
      <button onClick={()=>HomeRedirect()} className="cta-button">Home</button>
      <button onClick={()=>ListingRedirect()} className="cta-button">ListingPage</button>
      <button onClick={() => ProfilePageRedirect()} className="cta-button">Profile</button>
      <button onClick={() => MarketPlaceRedirect()} className="cta-button">Market Place</button>
    </div>
  )
}
