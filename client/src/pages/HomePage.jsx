import React from 'react'
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate();

    const MarketPlaceRedirect = () => {
        navigate("/market");
    }

    const ListingRedirect = () => {
        navigate("/listing");
    }
    
    const ProfilePageRedirect = () => {
      navigate("/profile");
  }

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => MarketPlaceRedirect()} className="cta-button">Market Place</button>
      <button onClick={() => ListingRedirect()} className="cta-button">Listing Page</button>
      <button onClick={() => ProfilePageRedirect()} className="cta-button">Profile</button>
    </div>
  )
}

export default HomePage