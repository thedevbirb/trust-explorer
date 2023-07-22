import { ethers } from "hardhat";

async function main() {
  const worldId = "0x58BF811321D2E953FcfbCA4CdEB7DB73beB72386";
  const eas = "0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84";
  const appId = "app_eb57bcd2529a2b84af1704d76ab9210c";
  const actionId = "attest";

  const lock = await ethers.deployContract("Reviewer", [
    worldId,
    eas,
    appId,
    actionId,
  ]);

  await lock.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
