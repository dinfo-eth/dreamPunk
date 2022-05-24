// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./base64.sol";

contract injectsvg is ERC721Enumerable, Ownable {
    using Strings for uint256;
    bool public paused = false;
    mapping(uint256 => Punk) public PunksToTokenId;

    struct Punk {
        string name;
        string description;
        string value;
    }

    constructor() ERC721("onChainNFT", "OCN") {}

    // public
    function mint(string memory _svgString) public payable {

        uint256 supply = totalSupply();
        //bytes memory strBytes = bytes(_userText);
        //require(exists(_userText) != true, "String already exists!");

        bytes memory strBytes = bytes(_svgString);
        require(exists(_svgString) != true, "String already exists!");

        Punk memory newPunk = Punk(
            string(abi.encodePacked("NFT", uint256(supply + 1).toString())),
            "This is our on-chain NFT",
            _svgString
        );


        if (msg.sender != owner()) {
            require(msg.value >= 0.005 ether);
        }

        PunksToTokenId[supply + 1] = newPunk; //Add Punk to mapping @tokenId
        _safeMint(msg.sender, supply + 1);
    }

    function exists(string memory _text) public view returns (bool) {
        bool result = false;
        //totalSupply function starts at 1, as does out wordToTokenId mapping
        for (uint256 i = 1; i <= totalSupply(); i++) {
            string memory text = PunksToTokenId[i].value;
            if (
                keccak256(abi.encodePacked(text)) ==
                keccak256(abi.encodePacked(_text))
            ) {
                result = true;
            }
        }
        return result;
    }

    function randomNum(
        uint256 _mod,
        uint256 _seed,
        uint256 _salt
    ) public view returns (uint256) {
        uint256 num = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, _seed, _salt)
            )
        ) % _mod;
        return num;
    }

    function buildMetadata(uint256 _tokenId)
        private
        view
        returns (string memory)
    {
        Punk memory currentPunk = PunksToTokenId[_tokenId];
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                currentPunk.name,
                                '", "description":"',
                                currentPunk.description,
                                '", "image": "',
                                "data:image/svg+xml;base64,",
                                currentPunk.value,
                                '", "attributes": ',
                                "[",
                                '{"trait_type": "TextColor",',
                                '"value":"',
                                currentPunk.name,
                                '"}',
                                "]",
                                "}"
                            )
                        )
                    )
                )
            );
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return buildMetadata(_tokenId);
    }

    //only owner
    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}
