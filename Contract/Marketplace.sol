
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721, Ownable {

    uint256 public nftCount = 0;

    struct NFT {

        string name;

        string description;

        uint256 price;

        address payable owner;

        bool forSale;

    }

    mapping(uint256 => NFT) public nfts;

    constructor() ERC721("NFTMarketplace", "NFTM") {}

    function createNFT(string memory _name, string memory _description, uint256 _price) public {

        nftCount++;

        _safeMint(msg.sender, nftCount);

        NFT memory newNFT = NFT({

            name: _name,

            description: _description,

            price: _price,

            owner: payable(msg.sender),

            forSale: true

        });

        nfts[nftCount] = newNFT;

        emit NFTCreated(nftCount, newNFT.name, newNFT.description, newNFT.price, msg.sender);

    }

    function getNFTCount() public view returns (uint256) {

        return nftCount;

    }

    function getNFT(uint256 _id) public view returns (NFT memory) {

        require(_exists(_id), "NFT does not exist");

        return nfts[_id];

    }

    function purchaseNFT(uint256 _id) public payable {

        require(_exists(_id), "NFT does not exist");

        NFT storage nft = nfts[_id];

        require(nft.forSale, "NFT not for sale");

        require(msg.value >= nft.price, "Insufficient funds");

        nft.owner.transfer(msg.value);

        safeTransferFrom(nft.owner, msg.sender, _id);

        nft.forSale = false;

        nft.owner = payable(msg.sender);

        emit NFTPurchased(_id, nft.name, nft.description, nft.price, msg.sender);

    }

    function withdrawFunds(address payable _seller) public onlyOwner {

        require(_seller != address(0), "Invalid address");

        _seller.transfer(address(this).balance);

        emit FundsWithdrawn(_seller, address(this).balance);

    }

    event NFTCreated(uint256 indexed id, string name, string description, uint256 price, address owner);

    event NFTPurchased(uint256 indexed id, string name, string description, uint256 price, address buyer);

    event FundsWithdrawn(address seller, uint256 amount);

}

