import "./App.css";

import { useEffect } from 'react';

import {init} from './components/Web3Client'

import HomePage from "./pages/HomePage";

import { MarketPlacePage } from "./pages/MarketPlacePage";

import  MarketProductPage  from "./pages/MarketProductPage";

import ListingPage from "./pages/ListingPage"
import ProfilePage from "./pages/ProfilePage"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductPage } from "./pages/ProductPage";

function App() {  
  useEffect(()=>{
    init()
  }, []);

  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/market" element={<MarketPlacePage/>}/>
        <Route path="/market/product/:id" element={<MarketProductPage/>}/>
        <Route path="/listing" element={<ListingPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/product/:id" element={<ProductPage/>}/>
        <Route path="/*" element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  )

}

export default App;