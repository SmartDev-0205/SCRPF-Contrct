const { expect } = require("chai");
const fs = require("fs");
const { ethers } = require("hardhat");
const SCRPF = require("../artifacts/contracts/SCRPF.sol/CRPF.json").abi;
const Accounting =
	require("../artifacts/contracts/Accounting.sol/Account.json").abi;

const { delay, fromBigNum, toBigNum } = require("./utils.js")

var owner;
var network;

var scrpfContract;
var accountingContract;

describe("deploy contracts", function () {
	it("Create account", async function () {
		[owner, addr1, addr2] = await ethers.getSigners();
		console.log("This is owner address : ", owner.address);
		console.log("This is owner address : ", addr1.address);
	});

	it("deploy contracts", async function () {
		const ERC20TOKEN = await ethers.getContractFactory("CRPF");
		scrpfContract = await ERC20TOKEN.deploy();
		// console.log("Contract address :", scrpfContract.address);
		await scrpfContract.deployed();
		const AccountingContract = await ethers.getContractFactory("Account");
		accountingContract = await AccountingContract.deploy();
		// console.log("Contract address :", accountingContract.address);
		// console.log("Accounting contract was finished.");
		await scrpfContract.setAccountingAddress(accountingContract.address);
	});

	it("Factory deploy", async function () {
		const Factory = await ethers.getContractFactory("PancakeswapFactory");
		exchangeFactory = await Factory.deploy(owner.address);
		await exchangeFactory.deployed();
		console.log(await exchangeFactory.INIT_CODE_PAIR_HASH())
	});

	it("WETH deploy", async function () {
		const WETH = await ethers.getContractFactory("WETH9");
		wETH = await WETH.deploy();
		await wETH.deployed();
	});

	it("Router deploy", async function () {
		const Router = await ethers.getContractFactory("PancakeswapRouter");
		exchangeRouter = await Router.deploy(exchangeFactory.address, wETH.address);
		await exchangeRouter.deployed();
	});

});

describe("Contract Test", function () {

	it("SCRPF Add Liquidity", async function () {

		var tx = await scrpfContract.approve(exchangeRouter.address, ethers.utils.parseUnits("100000000", 18));
		await tx.wait();
		tx = await exchangeRouter.addLiquidityETH(
			scrpfContract.address,
			ethers.utils.parseUnits("500000", 18),
			0,
			0,
			owner.address,
			"111111111111111111111",
			{ value: ethers.utils.parseUnits("10", 18) }
		);
		await tx.wait();
	});

});
