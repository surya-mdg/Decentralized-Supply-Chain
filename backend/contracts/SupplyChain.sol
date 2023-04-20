// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "../node_modules/hardhat/console.sol";

contract SupplyChain 
{
    uint256 public prodCount;
    uint256 prodIndexOffset = 1000000000;

    mapping(uint256 => string) prodId; //Maps names of products with a unique id
    mapping(uint256 => Product) prodIndex; //Maps the product code with the respective product
    mapping(address => User) users; //Maps the address of a user with their information

    event ProductCreated(uint256 prodIndex); //Event to indicate a new product has been created

    constructor()
    {
        prodId[0] = "Peanut Butter";
        prodId[1] = "Mixed Fruit Jam";
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
        string prodDesc;
        address nodeAddress;
    }

    struct Product //Product's supply chain information is stored here
    {
        string name;
        Node[] nodes;
    }

    function CreateProduct(uint256 _id) external //Generates a unique non-random code and maps it with the newly created product
    {
        Node[] memory nullNodeArray;
        Product memory prod = Product(prodId[_id], nullNodeArray);
        uint256 prodCode = (_id * prodIndexOffset) + prodCount;
        prodIndex[prodCode] = prod;
        prodCount++;

        emit ProductCreated(prodCode);
    }
}