const hre = require("hardhat");

async function main() {
  const FoodCommerce = await hre.ethers.getContractFactory("FoodCommerce");
  const foodCommerce = await FoodCommerce.deploy();

  await foodCommerce.waitForDeployment();

  console.log(
    `FoodCommerce deployed to ${foodCommerce.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
