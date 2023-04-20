const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SupplyChain", function () {
  let supplyChain
  let deployer, user1, user2, users
  beforeEach(async () => {
    [deployer, user1, user2, ...users] = await ethers.getSigners();
    const supplyChainFactory = await ethers.getContractFactory("SupplyChain");
    supplyChain = await supplyChainFactory.deploy();
  })

  describe("Get Token Count",async()=>{
    it("Should get token count",async function() {
      let count = await supplyChain.GetCount();
      expect(count).to.equal(1);
    })
  })
});
