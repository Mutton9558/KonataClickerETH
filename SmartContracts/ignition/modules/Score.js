const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ScoreModule", (m) => {
  const scoreData = m.contract("ScoreData");

  return { scoreData };
});
