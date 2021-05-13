import { ethers } from "../js/ethers/dist/ethers.esm.min.js";
import Const from "../js/contract.js";


var MyContract = Const();
const abi = MyContract[0];
const address = MyContract[1];

let provider;
let signer;
var contract;

async function init() {
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    signer = provider.getSigner();
    contract = new ethers.Contract(address, abi, signer);
}
init();

async function show() {
    let addr = await signer.getAddress();
    document.getElementById('test1').textContent = addr;
    await provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0]);
        contract = new ethers.Contract(address, abi, signer);
        console.log(signer);
    })
    document.getElementById('test2').textContent = addr;
    await provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[1]);
        contract = new ethers.Contract(address, abi, signer);
        console.log(signer);
    })
    document.getElementById('test3').textContent = addr;
}
show();