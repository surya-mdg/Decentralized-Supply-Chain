// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "../node_modules/hardhat/console.sol";

contract SupplyChain 
{
    uint256 public prodCount;
    uint256 prodIndexOffset = 1000000000;
    string password = "$2a$12$REJHy2aPASYWEXUdVwjpZu5xbR2OTludsvq4iYoPap/k1UUbo5Sjy";

    mapping(uint256 => Product) prodId; //Maps names of products with a unique id
    mapping(uint256 => uint256) prodIndex; //Maps the product code with the respective product information
    mapping(uint256 => bool) prodExist; //Used to check if product code exists or not
    mapping(address => User) users; //Maps the address of a user with their information
    mapping(uint256 => Node[]) public supplyChain; //Stores the supply chain for each product created

    constructor()
    {
        prodId[0] = Product("Peanut Butter", "Food paste or spread made from ground, dry-roasted peanuts.");
        prodId[1] = Product("Mixed Fruit Jam", "Made from a mixture of fruits are usually called conserves, especially when they include citrus fruits, nuts, raisins, or coconut.");
    }

    struct User //Used to store user information
    {
        string userType;
        string name;
        string location;
        string userDesc;
    }

    struct Node //Used to form the supply chain
    {
        User userInfo;
        string prodName;
        string processDesc;
        address nodeAddress;
    }

    struct Product //Product's supply chain information is stored here
    {
        string name;
        string desc;
    }

    function CreateProduct(uint256 _id) external//Generates a unique non-random code and maps it with the newly created product
    {
        uint256 prodCode = (_id * prodIndexOffset) + prodCount;
        prodIndex[prodCode] = _id;
        prodExist[prodCode] = true;
        prodCount++;
    }
    
    function GetProductCode(uint256 _id) external view returns(uint256) //Gets the product code of the most recently created product
    {
        return (_id * prodIndexOffset) + (prodCount - 1);
    }

    function GetSupplyChain(uint256 _prodCode) external view returns(Node[] memory) //Gets supply chain for the respective product code
    {
        return supplyChain[_prodCode];
    }

    function GetUser() external view returns(User memory) //Get user info
    {
        return users[msg.sender];
    }

    function Login(string memory _password) external view returns(bool) //Compares password entered to the password stored here
    {
        if(keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(password)))
            return true;
        else 
            return false;
    }

    function UpdateSupplyChain(uint256 _prodCode, string memory _prodName, string memory _prodDesc) external //Adds a node to the supply chain for the respective product code
    {
        require(prodExist[_prodCode], "Invalid Product Code");

        supplyChain[_prodCode].push(Node(users[msg.sender], _prodName, _prodDesc, msg.sender));
    }

    function UpdateUser(string memory _userType, string memory _name, string memory _location, string memory _userDesc) external //Update information of the user
    {
        User memory user = User(_userType, _name, _location, _userDesc);
        users[msg.sender] = user;
    }
}