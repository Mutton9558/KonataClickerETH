const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ScoreData", function () {
  let scoreData;
  let owner;
  let user1;

  beforeEach(async () => {
    const ScoreData = await ethers.getContractFactory("ScoreData");
    [owner, user1] = await ethers.getSigners();
    scoreData = await ScoreData.deploy();
  });

  it("should allow a user to set and get their score", async () => {
    await scoreData.connect(user1).setData(42);
    const stored = await scoreData.getData(user1.address);
    expect(stored).to.equal(42);
  });

  it("should return 0 for users with no score set", async () => {
    const score = await scoreData.getData(user1.address);
    expect(score).to.equal(0);
  });

  it("should allow multiple users to have different scores", async () => {
    await scoreData.connect(user1).setData(100);
    await scoreData.connect(owner).setData(200);

    expect(await scoreData.getData(user1.address)).to.equal(100);
    expect(await scoreData.getData(owner.address)).to.equal(200);
  });
});
