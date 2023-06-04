const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const BigNumber = ethers.BigNumber;

const CompareObj = (_obj1, _obj2) => {
  for(let i = 0; i < _obj2.length; i++)
  {
    if(_obj1[i] !== _obj2[i])
      return false;
    
    return true;
  }
}

const ConvertBigNumber = (_bigNum) => {
  const bigNumber = BigNumber.from(_bigNum);
  return bigNumber.toNumber();
}

describe("SupplyChain", function () {
  let supplyChain
  let deployer, user1, user2, users
  beforeEach(async () => {
    [deployer, user1, user2, ...users] = await ethers.getSigners();
    const supplyChainFactory = await ethers.getContractFactory("SupplyChain");
    supplyChain = await supplyChainFactory.deploy();
  })

  describe("Create New Product",async()=>{
    it("Should create new product and increment product count",async function() {
      expect(await supplyChain.prodCount()).to.equal(0);
      await supplyChain.CreateProduct(1);
      await supplyChain.CreateProduct(1);
      expect(ConvertBigNumber(await supplyChain.GetProductCode(1))).to.equal(1000000001);
      expect(await supplyChain.prodCount()).to.equal(2);
    })
  })

  describe("Check Password",async()=>{
    it("Should check if the password passed is equal to the stored password",async function() {
      expect(await supplyChain.Login("$2a$12$REJHy2aPASYWEXUdVwjpZu5xbR2OTludsvq4iYoPap/k1UUbo5Sjy")).to.equal(true);
    })
  })

  describe("Create New User",async()=>{
    it("Should create new user and store info",async function() {
      await supplyChain.connect(user1).UpdateUser("Supplier", "Elon Musk", "elon@gmail.com", "Produces high quality pure butter", "Mysore - 570020","file.com");
      const userInfo = await supplyChain.connect(user1).GetUser();
      expect(CompareObj(userInfo, [0,"Supplier", "Elon Musk", "elon@gmail.com", "Produces high quality pure butter", "Mysore - 570020"])).to.equal(false);
    })
  })

  describe("Update Supply Chain",async()=>{
    it("Should update the supply chain of the specific product",async function() {
      await supplyChain.CreateProduct(1);
      await supplyChain.connect(user1).UpdateUser("Supplier", "Elon Musk", "elon@gmail.com", "Produces high quality pure butter", "Mysore - 570020","file.com");
      await expect(supplyChain.connect(user1).UpdateSupplyChain(1000000000, "Packaged 100kg of butter")).to.emit(supplyChain,"ChainUpdated").withArgs();
      await expect(supplyChain.connect(user1).UpdateSupplyChain(1000000002, "Packaged 100kg of butter")).to.be.revertedWith('Invalid Product Code');
    })
  })

  describe("Get Supply Chain",async()=>{
    it("Should get info about the supply chain for specific product",async function() {
      await supplyChain.CreateProduct(1);
      await supplyChain.connect(user1).UpdateUser("Supplier", "Elon Musk", "elon@gmail.com", "Produces high quality pure butter", "Mysore - 570020","file.com");
      await expect(supplyChain.connect(user1).UpdateSupplyChain(1000000000, "Packaged 100kg of butter")).to.emit(supplyChain,"ChainUpdated").withArgs();
      const info = await supplyChain.GetSupplyChain(1000000000);
      const timestamp = new Date(info[0][4] * 1000);
      const chainInfo = {type: info[0][0][0], owner: info[0][0][1], location: info[0][0][2], desc: info[0][0][3], prodName: info[0][1], processDesc: info[0][2], nodeAdd: info[0][3], timestamp: timestamp.toLocaleString()};
      console.log(chainInfo);
      expect(chainInfo.nodeAdd).to.equal(user1.address);
    })
  })

  describe("Donate to Farmer", async()=>{
    it("Should donate to farmer", async function() {
      await supplyChain.connect(user1).UpdateUser("Farmer", "Elon Musk", "elon@gmail.com", "6361751432", "Mysore - 570020","file.com");
      await supplyChain.connect(user2).Donate(0,{value: ethers.utils.parseEther("1")});
      const fundInfo = await supplyChain.GetDonations(0);
      expect(ethers.utils.formatEther(fundInfo[0])).to.equal('1.0');
      expect(BigNumber.from(fundInfo[1]).toNumber()).to.equal(1);
      expect(fundInfo[2][0][0]).to.equal(user2.address);
    })
  })
});
