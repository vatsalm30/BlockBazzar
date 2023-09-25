// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./Interfaces/ISaleTokens.sol";

contract SaleTokens is ERC1155, ISaleTokens {
    constructor() ERC1155("doesn't matter") {}

    struct Token {
        string _tokenURI;
        address _tokenMinter;
    }
    mapping(uint256 => Token) private _tokens;
    uint256 tokenId = 0;

    function setTokenURI(uint256 _tokenId, string memory _uri) private {
        _tokens[_tokenId]._tokenURI = _uri;
    }

    function mintItems(uint256 numItems, string memory metadataURI)
        public
        override
    {
        bool isNew = true;
        uint256 currentTokenId = 0;
        for (uint256 i = 1; i <= tokenId; i++) {
            if (stringsEquals(_tokens[i]._tokenURI, metadataURI)) {
                isNew = false;
                currentTokenId = i;
                break;
            }
        }
        bytes memory byteMetadata = bytes(metadataURI);
        if (isNew || _tokens[currentTokenId]._tokenMinter != msg.sender) {
            tokenId++;
            currentTokenId = tokenId;
            setTokenURI(currentTokenId, metadataURI);
            _tokens[currentTokenId]._tokenMinter = msg.sender;
            _mint(msg.sender, currentTokenId, numItems, byteMetadata);
        } else if (
            !isNew && _tokens[currentTokenId]._tokenMinter == msg.sender
        ) {
            setTokenURI(currentTokenId, metadataURI);
            _mint(msg.sender, currentTokenId, numItems, byteMetadata);
        }
    }

    function stringsEquals(string memory s1, string memory s2)
        private
        pure
        returns (bool)
    {
        bytes memory b1 = bytes(s1);
        bytes memory b2 = bytes(s2);
        uint256 l1 = b1.length;
        if (l1 != b2.length) return false;

        return keccak256(b1) == keccak256(b2);
    }

    function transferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount
    ) public virtual override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not token owner or approved"
        );
        _safeTransferFrom(from, to, id, amount, "");
    }

    function editToken(uint256 _tokenId, string calldata newURI) public override {
        require(_tokenId <= tokenId && _tokenId > 0, "Invalid token, or token does not exist.");
        require(_tokens[_tokenId]._tokenMinter == msg.sender, "Only token minter can edit token.");
        require(keccak256(abi.encodePacked(_tokens[_tokenId]._tokenURI)) != keccak256(abi.encodePacked(newURI)), "New URI must be different to oroginal URI");

        _tokens[_tokenId]._tokenURI = newURI;
    }

    function uri(uint256 tokenNum)
        public
        view
        override
        returns (string memory)
    {
        return _tokens[tokenNum]._tokenURI;
    }

    function getLastTokenId() public view override returns (uint256) {
        return tokenId;
    }

    function burn(uint256 _tokenId, uint256 amount) public override {
        _burn(msg.sender, _tokenId, amount);
    }

    function getMinter(uint256 _tokenId) public view returns (address) {
        return _tokens[_tokenId]._tokenMinter;
    }
}
