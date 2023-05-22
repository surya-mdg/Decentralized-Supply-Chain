// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "../node_modules/hardhat/console.sol";

contract SupplyChain 
{
    uint256 public userCount;
    uint256 public prodCount;
    uint256 prodIndexOffset = 1000000000;
    string password = "$2a$12$REJHy2aPASYWEXUdVwjpZu5xbR2OTludsvq4iYoPap/k1UUbo5Sjy";
    string location = "Florida #27";

    mapping(uint256 => Product) prodId; //Maps names of products with a unique id
    mapping(uint256 => uint256) prodIndex; //Maps the product code with the respective product information
    mapping(uint256 => bool) prodExist; //Used to check if product code exists or not
    mapping(address => User) users; //Maps the address of a user with their information
    mapping(uint256 => Node[]) public supplyChain; //Stores the supply chain for each product created
    mapping(uint256 => Funds) public funds; //Stores the funds donated for each product created

    event ChainUpdated();

    constructor()
    {
        prodId[0] = Product("Peanut Butter", "Food paste or spread made from ground, dry-roasted peanuts.");
        prodId[1] = Product("Mixed Fruit Jam", "Made from a mixture of fruits are usually called conserves, especially when they include citrus fruits, nuts, raisins, or coconut.");
    }

    struct User //Used to store user information
    {
        uint256 id;
        string userType;
        string name;
        string email;
        string phone;
        string location;
    }

    struct Donator
    {
        address donatorAddress;
        uint256 amount;
    }

    struct Funds
    {
        uint256 donations;
        uint256 donationCount;
        Donator[] donators;
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

    function Donate(uint256 _id) public payable { //Donates funds to the respective user ID
        funds[_id].donations += msg.value;
        funds[_id].donationCount++;
        Donator memory donator = Donator(msg.sender, msg.value);
        funds[_id].donators.push(donator);      
    }

    function GetDonations(uint256 _id) external view returns(Funds memory) //Gets the total amount of donations for the respective product code
    {
        return funds[_id];
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

    function SetTracker(string memory _location) external //Sets the current location
    {
        location = _location;
    }

    function UpdateSupplyChain(uint256 _prodCode, string memory _prodName, string memory _prodDesc) external //Adds a node to the supply chain for the respective product code
    {
        require(prodExist[_prodCode], "Invalid Product Code");
        require(keccak256(abi.encodePacked(users[msg.sender].location)) == keccak256(abi.encodePacked(location)), "Not at Location");

        supplyChain[_prodCode].push(Node(users[msg.sender], _prodName, _prodDesc, msg.sender));

        emit ChainUpdated();
    }

    function UpdateUser(string memory _userType, string memory _name, string memory _email, string memory _phone, string memory _location) external //Update information of the user
    {
        if(keccak256(abi.encodePacked(users[msg.sender].name)) == keccak256(abi.encodePacked("")))
            userCount++;

        User memory user = User(userCount - 1, _userType, _name, _email, _phone, _location);
        users[msg.sender] = user;
    }
}