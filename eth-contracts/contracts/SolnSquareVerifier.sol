pragma solidity ^0.8.10;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

// TODO define a solutions struct that can hold an index & an address

// TODO define an array of the above struct

// TODO define a mapping to store unique solutions submitted

// TODO Create an event to emit when a solution is added

// TODO Create a function to add the solutions to the array and emit the event

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";

contract SolnSquareVerifier is CustomERC721Token {
    SquareVerifier private _myVerifier;
    using Pairing for *;

    struct Solution {
        uint256 index;
        address owner;
        bool minted;
    }

    Solution[] private _allSolutions;

    mapping(bytes32 => Solution) _solutionsMap;

    event SolutionAdded(bytes32 key, uint256 index, address owner);

    constructor(
        string memory name,
        string memory symbol,
        address verifierAddress
    )  CustomERC721Token(name, symbol){
        _myVerifier = SquareVerifier(verifierAddress);
    }

    function addSolution(
        SquareVerifier.Proof memory proof,
        uint256[2] memory input
    )
        external
        returns (
            bytes32 key,
            uint256 index,
            address owner
        )
    {
        key = getSolutionKey(proof, input);
        bool valid = _myVerifier.verifyTx(proof, input);
        require(
            _solutionsMap[key].owner == address(0),
            "This solution is already present"
        );
        require(valid, "Invalid solution");

        index = _allSolutions.length;
        owner = msg.sender;
        Solution memory newSolution = Solution(index, owner, false);

        _solutionsMap[key].index = index;
        _solutionsMap[key].owner = owner;

        _allSolutions.push(newSolution);

        emit SolutionAdded(key, index, owner);

        return (key, index, owner);
    }

    function mint(
        SquareVerifier.Proof memory proof,
        uint256[2] memory input,
        uint256 tokenId
    ) public {
        bytes32 key = getSolutionKey(proof, input);
        require(
            _solutionsMap[key].owner == msg.sender,
            "Not the owner of the solution."
        );
        require(
            !_solutionsMap[key].minted,
            "The solution has already been used"
        );

        _solutionsMap[key].minted = true;

        super._mint(msg.sender, tokenId);
    }

    function getSolutionKey(
        SquareVerifier.Proof memory proof,
        uint256[2] memory input
    ) internal pure returns (bytes32) {
        return (
            keccak256(
                abi.encodePacked(
                    proof.a.X,
                    proof.a.Y,
                    proof.b.X,
                    proof.b.Y,
                    proof.c.X,
                    proof.b.Y,
                    input
                )
            )
        );
    }
}
