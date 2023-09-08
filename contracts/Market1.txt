// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Market {
	enum ListingStatus {
		Active,
		OutOfStock,
		Cancelled
	}

	struct Listing {
		ListingStatus status;
		address seller;
		address token;
		uint tokenId;
		uint stock;
		uint price;
		string[] searchTerms;
	}

	event Listed(
		uint listingId,
		address seller,
		address token,
		uint tokenId,
		uint stock,
		uint price,
		string[] searchTerms
	);

	event Sale(
		uint listingId,
		address buyer,
		address token,
		uint tokenId,
		uint stock,
		uint price
	);

	event Cancel(
		uint listingId,
		address seller
	);

	uint private _listingId = 0;
	mapping(uint => Listing) private _listings;

	function listToken(address token, uint tokenId, uint price, uint stock, string[] calldata searchTerms) public {
        IERC721(token).approve(address(this), tokenId);
        IERC721(token).transferFrom(msg.sender, address(this), tokenId);
    
		Listing memory listing = Listing(
			ListingStatus.Active,
			msg.sender,
			token,
			tokenId,
			stock,
			price,
			searchTerms
		);

		_listingId++;

		_listings[_listingId] = listing;

		emit Listed(
			_listingId,
			msg.sender,
			token,
			tokenId,
			stock,
			price,
			searchTerms
		);
	}

	function getListing(uint listingId) public view returns (Listing memory) {
		return _listings[listingId];
	}

	function buyToken(uint listingId) public payable {
		Listing storage listing = _listings[listingId];

		require(msg.sender != listing.seller, "Seller cannot be buyer");
		require(listing.status == ListingStatus.Active, "Listing is not active");

		require(msg.value >= listing.price, "Insufficient payment");

		listing.stock--;

		if (listing.stock == 0){
			listing.status = ListingStatus.OutOfStock;
		}

		

		IERC721(listing.token).transferFrom(address(this), msg.sender, listing.tokenId);
		payable(listing.seller).transfer(listing.price);

		emit Sale(
			listingId,
			msg.sender,
			listing.token,
			listing.tokenId,
			listing.stock,
			listing.price
		);
	}

	function cancel(uint listingId) public {
		Listing storage listing = _listings[listingId];

		require(msg.sender == listing.seller, "Only seller can cancel listing");
		require(listing.status == ListingStatus.Active, "Listing is not active");

		listing.status = ListingStatus.Cancelled;
	
		IERC721(listing.token).transferFrom(address(this), msg.sender, listing.tokenId);

		emit Cancel(listingId, listing.seller);
	}
}
