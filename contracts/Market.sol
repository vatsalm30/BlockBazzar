// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./SaleTokens.sol";
import "./Interfaces/IMarket.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

contract Market is IMarket, ERC1155Receiver {
    struct Listing {
        uint256 tokenId;
        ListingStatus status;
        uint256 stock;
        uint256 price;
        address seller;
        address token;
        string[] searchItems;
    }

    uint256 listingId = 0;
    mapping(uint256 => Listing) private listings;

    function listEditProduct(
        uint256 tokenId,
        uint256 listAmount,
        uint256 listPrice,
        address token,
        string[] memory listingSearchItems,
        uint256 tokenToEdit
    ) public override {
        require(
            msg.sender == SaleTokens(token).getMinter(tokenId),
            "Token can only be listed by minter as you cannot buy and relist token"
        );
        require(
            listAmount <= SaleTokens(token).balanceOf(msg.sender, tokenId),
            "You do not have enough tokens"
        );

        bool newListing = tokenToEdit == 0;
        uint relistId = tokenToEdit;

        if(!newListing){

        uint256 amountToChangeStockBy = 0;

        if(listAmount < listings[relistId].stock){
            SaleTokens(token).burn(listings[relistId].tokenId, listings[relistId].stock - listAmount);
        }

        if(listAmount > listings[relistId].stock){
            amountToChangeStockBy = listAmount - listings[relistId].stock;
        }

        SaleTokens(token).transferFrom(
            msg.sender,
            address(this),
            tokenId,
            amountToChangeStockBy
        );

        listings[relistId] = Listing(
            tokenId,
            ListingStatus.Active,
            listAmount,
            listPrice,
            msg.sender,
            token,
            listingSearchItems
        );
        emit Listed(
            tokenId,
            relistId,
            listAmount,
            listPrice,
            msg.sender,
            token,
            listingSearchItems
        );
        }

        if(newListing) {
        SaleTokens(token).transferFrom(
            msg.sender,
            address(this),
            tokenId,
            listAmount
        );

        listingId++;
        listings[listingId] = Listing(
            tokenId,
            ListingStatus.Active,
            listAmount,
            listPrice,
            msg.sender,
            token,
            listingSearchItems
        );
        emit Listed(
            tokenId,
            listingId,
            listAmount,
            listPrice,
            msg.sender,
            token,
            listingSearchItems
        );
        }
    }

    function buyProduct(uint256 _listingId, uint256 amountToBuy)
        public
        override
        payable
    {
        require(
            msg.sender != listings[_listingId].seller,
            "Seller cannot buy their own token"
        );

        require(listings[_listingId].status == ListingStatus.Active, "Listing Must be active");

        require(listingId >= _listingId, "Listing doesn't exist");

        require(msg.value>=listings[_listingId].price*amountToBuy, "Must pay more thanlisting price");

        listings[_listingId].stock -= amountToBuy;

        if(listings[_listingId].stock == 0){
            listings[_listingId].status = ListingStatus.SoldOut;
        }

        SaleTokens(listings[_listingId].token).transferFrom(
            address(this),
            msg.sender,
            listings[listingId].tokenId,
            amountToBuy
        );

        payable(listings[_listingId].seller).transfer(listings[_listingId].price*amountToBuy);

        emit Sale(
            listingId,
            amountToBuy,
            listings[_listingId].price,
            listings[_listingId].seller,
            msg.sender,
            listings[_listingId].token
        );
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return 0xf23a6e61;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return 0xbc197c81;
    }

    function getNumOfListings() public view override returns (uint256) {
        return listingId;
    }
    
    function getTokenPrice(uint256 _listingId) public view override returns (uint256) {
        return listings[_listingId].price;
    }

    function getTokenId(uint256 _listingId) public view override returns (uint256) {
        return listings[_listingId].tokenId;
    }

    function getTokenStock(uint256 _listingId) public view override returns (uint256) {
        return listings[_listingId].stock;
    }

    function getTokenStatus(uint256 _listingId) public view override returns (ListingStatus) {
        return listings[_listingId].status;
    }

    function getTokenSeller(uint256 _listingId) public view override returns (address) {
        return listings[_listingId].seller;
    }

    function getTokenSearchTerms(uint256 _listingId) public view override returns (string[] memory) {
        return listings[_listingId].searchItems;
    }

    function getListingTokenURI(uint256 _listingId)
        public
        view
        override
        returns (string memory)
    {
        return
            SaleTokens(listings[_listingId].token).uri(
                listings[_listingId].tokenId
            );
    }
}
