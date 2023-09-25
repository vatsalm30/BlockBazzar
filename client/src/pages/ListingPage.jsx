import React from 'react'
import {NFTMint} from '../components/NFTMint'
import { useNavigate } from 'react-router-dom'


const ListingPage = () => {
    const navigate = useNavigate()
    const MarketPlaceRedirect = () => {
        navigate("/market");
      }
      const HomeRedirect = () => {
          navigate("/");
      }
          
    const ProfilePageRedirect = () => {
      navigate("/profile");
  }
  return (
    <div>
        ListingPage
        <button onClick={() => HomeRedirect()} className="cta-button">Home</button>
        <button onClick={() => MarketPlaceRedirect()} className="cta-button">Market Place</button>
        <button onClick={() => ProfilePageRedirect()} className="cta-button">Profile</button>
        <NFTMint/>
    </div>
  )
}

export default ListingPage