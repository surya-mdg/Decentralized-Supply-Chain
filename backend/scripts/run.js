const main = async () => {
    const supplyChainContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const supplyChainContract = await supplyChainContractFactory.deploy();
    await supplyChainContract.deployed();
    console.log("Contract deployed to:", supplyChainContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
  };
  
  runMain();