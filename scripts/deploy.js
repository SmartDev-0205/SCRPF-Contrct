const fs = require("fs");
const colors = require("colors");
const { ethers } = require("hardhat");
const SCRPF = require("../artifacts/contracts/SCRPF.sol/CRPF.json").abi;
const Router =
    require("../interface/router.json").abi;

const Account =
    require("../artifacts/contracts/Accounting.sol/Account.json").abi;

var scrpfContract;
var accountingContract;

async function main() {
    // get network
    let [owner] = await ethers.getSigners();
    console.log(owner.address);
    let network = await owner.provider._networkPromise;

    //QE token deployment
    const ERC20TOKEN = await ethers.getContractFactory("CRPF");
    scrpfContract = await ERC20TOKEN.deploy();
    console.log("Contract address :", scrpfContract.address);
    await scrpfContract.deployed();

    //presale deployment
    const AccountingContract = await ethers.getContractFactory("Account");
    accountingContract = await AccountingContract.deploy();
    console.log("Contract address :", accountingContract.address);
    console.log("Accounting contract was finished.");
    await scrpfContract.setAccountingAddress(accountingContract.address);

    // Get router contract 
    const fantomeRouter = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
    

    // deployment result
    var contractObject = {
        token: {
            address: tokenContract.address,
            abi: ERC20ABI
        },
        presale: {
            address: scrpfContract.address,
            abi: PresaleABI
        }
    }

    fs.writeFileSync(
        `./build/${network.chainId}.json`,
        JSON.stringify(contractObject, undefined, 4)
    );
}

main()
    .then(() => {
        console.log("complete".green);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
