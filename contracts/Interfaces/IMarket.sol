// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMarket {
    enum ListingStatus {
        Active,
        SoldOut,
        Canceled
    }

    event Listed(
        uint256 tokenId,
        uint256 listingId,
        uint256 stock,
        uint256 price,
        address lister,
        address token,
        string[] searchTerms
    );

    event Sale(
        uint256 listingId,
        uint256 amountBought,
        uint256 priceBought,
        address lister,
        address buyer,
        address token
    );

    function listEditProduct(
        uint256 tokenId,
        uint256 listAmount,
        uint256 listPrice,
        address token,
        string[] memory listingSearchItems,
        uint256 tokenToEdit
    ) external;

    function buyProduct(uint256 _listingId, uint256 amountToBuy)
        external
        payable;

    function getNumOfListings() external view returns (uint256);

    function getTokenPrice(uint256 _listingId) external returns (uint256);

    function getTokenId(uint256 _listingId) external returns (uint256);

    function getTokenStock(uint256 _listingId) external returns (uint256);

    function getTokenStatus(uint256 _listingId) external returns (ListingStatus);

    function getTokenSeller(uint256 _listingId) external returns (address);

    function getTokenSearchTerms(uint256 _listingId) external returns (string[] memory);

    function getListingTokenURI(uint256 _listingId)
        external
        view
        returns (string memory);
}
