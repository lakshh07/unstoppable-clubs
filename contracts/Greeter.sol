//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Memlock {
    address[] internal creatorsAddress;
    uint256 numCreators = 0;
    uint256 numFiles = 0;

    struct File {
        uint256 fileId;
        string fileName;
        string fileTitle;
        string fileDescription;
        string fileHash;
    }

    struct Creator {
        uint256 creatorId;
        address creatorAddress;
        string creatorName;
        string creatorDescription;
        uint256 creatorPrice;
        string imageHash;
    }

    mapping(uint256 => Creator) public creators;
    mapping(address => File[]) public files;
    mapping(address => uint256) public filesNum;

    event Create(
        uint256 creatorId,
        address payable creatorAddress,
        string creatorName,
        string creatorDescription,
        uint256 creatorPrice,
        string imageHash
    );
    event Subscribe(
        uint256 _id,
        uint256 _price,
        address _sender,
        address _receiver
    );

    function create(
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _hash
    ) external {
        require(_price >= 0, "Price too low");
        uint256 _creatorId = ++numCreators;
        creators[_creatorId] = Creator(
            _creatorId,
            msg.sender,
            _name,
            _description,
            _price,
            _hash
        );
        creatorsAddress.push(msg.sender);
        emit Create(
            _creatorId,
            payable(msg.sender),
            _name,
            _description,
            _price,
            _hash
        );
    }

    function subscribe(uint256 _id) external payable {
        require(msg.sender != creators[_id].creatorAddress);
        require(msg.value == creators[_id].creatorPrice, "Price Invalid");
        payable(creators[_id].creatorAddress).transfer(msg.value);

        emit Subscribe(
            _id,
            msg.value,
            msg.sender,
            creators[_id].creatorAddress
        );
    }

    function upload(
        string memory _name,
        string memory _description,
        string memory _title,
        string memory _hash
    ) external {
        uint256 _fileId = ++numFiles;
        files[msg.sender].push(
            File(_fileId, _name, _title, _description, _hash)
        );
        filesNum[msg.sender]++;
    }

    function checkUser() external view returns (address[] memory) {
        return creatorsAddress;
    }
}
