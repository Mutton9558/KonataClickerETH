# KonataClickerETH
Konata Clicker but now with Blockchain
Currently I haven't fully set up the data storing system so users data is technically only
being fetched and stored on one address

# For cloners
1. Compile hardhat
```
cd SmartContracts
npx hardhat compile
```
2. Start SmartContract server on localhost (this is for the free 10000 ETH 🤑)
```
npx hardhat node
```
3. Deploy using ignition deploy
```
npx hardhat ignition deploy ignition/modules/Score.js --network localhost
```
4. In a new terminal go back to root dir and then nextjs dir
```
cd ..
cd konataclickerbc
```
5. Start node server
```
npm run dev
```
