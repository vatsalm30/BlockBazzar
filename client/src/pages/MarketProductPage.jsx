import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {getListingTokenURI, getListingTokenSeller, getListingTokenId, buyToken, listingPrice, listingStock} from '../components/Web3Client'
import Web3 from "web3";
import Decimal from 'decimal.js';

const MarketProductPage = () => {
    const navigate = useNavigate()
  const {id} = useParams()

  const [image, setImage] = useState(new Blob())
  const [name, setName] = useState("")
  const [descr, setDescr] = useState("")
  const [isMinter, setIsMinter] = useState(false)
  const [tokenId, setTokenId] = useState(0)
  const [tokenStock, setTokenStock] = useState("")
  const [tokenPrice, setTokenPrice] = useState("")
  const [amountToBuy, setAmountToBuy] = useState(0)
  const [reviews, setReviews] = useState()
  const [account, setAccount] = useState()
  const [reviewerNames, setReviewerNames] = useState([])
    useEffect(() => {
        try{
            fetchTokenURI(id)
            getListingTokenId(id).then((tkId) => {
                setTokenId(tkId)
            })
            listingPrice(id).then((price)=>{
              const priceNum = new Decimal(price.toString())
              const divisorNum = new Decimal(1e18)
              setTokenPrice((priceNum.dividedBy(divisorNum)).toString())
              // console.log((priceNum.dividedBy(divisorNum)).toString())
            })

            listingStock(id).then(stock => {
              setTokenStock(stock.toString())
            })
            
        }
        catch (err){
            navigate("/market/product/"+id)
        }
      if (typeof window.ethereum !== 'undefined') {
        // Request the user's accounts from MetaMask
        const web3 = new Web3(window.ethereum);
        window.ethereum.request({ method: 'eth_accounts' })
          .then(async (result) => {
              try{
                setAccount(result[0])
                getListingTokenSeller(id).then(minter=>{
                  setIsMinter(window.BigInt(minter)==window.BigInt(result[0]))
                })
                  }
                  catch (err){
                      navigate("/market/product/"+id)
                  }
          })
          .catch((error) => {
            console.error('Error retrieving accounts:', error);
          });

          window.ethereum.on('accountsChanged', function(){
            navigate("/")
            navigate("/market/product/"+id)
          })

      } else {
        console.error('MetaMask is not installed');
      }
    });

    useEffect(() => {
      fetchReviews(parseInt(id));
      loopOverReviews();
    }, []);

    const fetchReviews = (_idTokenID) => {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8080/retriveReviews", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onload = () => {
          console.log(xhr.responseText);
          try{
            const userData = JSON.parse(xhr.responseText);
            setReviews(userData)
          }
          catch{
          }
        }
      xhr.send(JSON.stringify({"_id": _idTokenID}));
    }


    const fetchUsername = (_idAddress) => {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8080/retriveUserData", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onload = () => {
          console.log(xhr.responseText);
          try{
            const userData = JSON.parse(xhr.responseText);
            setReviewerNames(...reviewerNames, userData["username"]);
          }
          catch{
            //setReviewerNames(...reviewerNames, userData["username"]);
          }
        }
      xhr.send(JSON.stringify({"_id": _idAddress}));
    }
    
    const loopOverReviews = () => {
      for (let i = 0; i < reviews.length; i++) {
        fetchUsername(reviews[i]["reviewer_address"])
      }
    }

    const uploadReview = (_idAddress, rating, review) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8080/loadReview", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
          console.log(xhr.responseText);
        }
        const date = new Date();
        xhr.send(JSON.stringify({"_id": parseInt(id), "reviewer_address": account, "buy_price": 0, "likes": rating, "post_timestamp": date.getTime(), "review": review}));
    }

    const leaveReview = (e) => {
      e.preventDefault();
      uploadReview(account, e.target[0].value, e.target[1].value);
    }

  function fetchTokenURI(tokenID) {
        getListingTokenURI(parseInt(tokenID)).then(async CID => {
          await fetch(CID.replace("ipfs://", "https://").replace("/metadata.json", ".ipfs.dweb.link/metadata.json")).then(async res => {
              const json = await res.json()
              setImage(json["image"].replace("ipfs://", "https://").replace("/blob", ".ipfs.dweb.link/blob"))
              setName(json["name"])
              setDescr(json["description"])
          })
          }).catch(error => {
          console.error(error)
      });
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
  
  const changeAmountToBuy = (e) => {
    setAmountToBuy(e.target.value)
  }

  const handelSubmitBuy = (e) => {
    e.preventDefault()
    listingPrice(id).then((price) => {
      buyToken(id, amountToBuy, window.Number(price)*window.Number(amountToBuy)).catch(error => {
        console.log(error)
      })
    })
  }

  const c = (s) => {
    console.log(s)
    return s
  }

  return (
    <div>
      <h1>{name}</h1>
      <h2>Price: {tokenPrice} ETH</h2>
      <h2>Stock: {tokenStock}</h2>
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
      <br></br><br></br>
      {isMinter ?(        
        <form onSubmit={()=>navigate("/product/"+tokenId)}>
          <input type='submit' value="Edit or Mint More" className="cta-button"/>
        </form>):(
            <form onSubmit={handelSubmitBuy}>
              <label>Amount To Buy: </label>
              <input type="number" className="cta-text" onChange={changeAmountToBuy}/>
              <br></br>
              <input type='submit' value="Buy Now" className="cta-button"/>
            </form>
        )}
      <br></br>
      <button onClick={()=>HomeRedirect()} className="cta-button">Home</button>
      <button onClick={()=>ListingRedirect()} className="cta-button">ListingPage</button>
      <button onClick={() => ProfilePageRedirect()} className="cta-button">Profile</button>
      <button onClick={() => MarketPlaceRedirect()} className="cta-button">Market Place</button>
      <br/>
      <br/>
      <h1>Leave A Review: </h1>
      <form onSubmit={leaveReview}>
        <label>Stars: </label>
        <input type="number" className="cta-text"/>
        <br/>
        <label>Review: </label>
        <input type="text" className="cta-text"/>
        <br></br>
        <input type='submit' value="Leave Review" className="cta-button"/>
      </form>
      <br/>
      <br/>
      <h1>Reviews: </h1>
      <div>{reviews?  
      reviews.map((review, key)=>{
        return (
          <div>
            <h2>{reviewerNames[key]}</h2>
            <p>{review.review}</p>
          </div>
        )
      })
      : "no reviews yet"
      }</div>
    </div>
  );
}

export default MarketProductPage