# solidity

* The inbox folder has a very simple solidity contract with a bit of automated testing using mocha and automated deployments using the Rinkeby network and truffle

* The lottery folder has a simple solidity contract for a lottery application

* The lottery-react folder adds a simple react application that interacts with the Solidity contract.

* The kickstart folder has two contracts: Campaign and CampaignFactory. The Factory contract is used to create new instances of the Campaign contract. We use Next.js for server side rendering and Semantic UI React for styling.
** To deploy the kickstart app:
** ```
node ./ethereum/compile.js
node ethereum/deploy.js "your eth secret mnemonic phrase"
```

https://www.udemy.com/ethereum-and-solidity-the-complete-developers-guide/