// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ISaleTokens {
    /**
    @dev This function is used to mint a specified number of items with the given metadata URI
    Params:
    - numItems: the number of items to mint
    - metadatURI: the metadata URI for the items
    **/
    function mintItems(uint256 numItems, string memory metadataURI) external;

    /**
    @dev This function is used to transfer a specified number of items to an account from specified account
    Params:
    - from: the sending account
    - to: the reciving account
    - id: the tokenId
    - amount: the amount of tokens that are to be transfered
    **/
    function transferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount
    ) external;

    function editToken(uint256 _tokenId, string memory newURI) external;

    /**
    @dev Returns the number of different tokens that have been minted
    **/
    function getLastTokenId() external view returns (uint256);

    /**
    @dev This function allows the caller to burn a specific amount of tokens
    Params:
    - _tokenId: the token to burn
    - amount: the amount of tokens to burn
    **/
    function burn(uint256 _tokenId, uint256 amount) external;

    /**
    @dev Returns the address of the minter of a specific token
    Params:
    - _tokenId: the token that needs to be found
    **/

    function getMinter(uint256 _tokenId) external returns (address);
}
