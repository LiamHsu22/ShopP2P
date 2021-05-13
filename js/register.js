import { ethers } from "../js/ethers/dist/ethers.esm.min.js";
import Const from "./contract.js";


var MyContract = Const();
const abi = MyContract[0];
const address = MyContract[1];

let provider;

async function init() {
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
}
init();

async function send() {
    const signer = provider.getSigner();
    var contract = new ethers.Contract(address, abi, signer);
    var name = document.getElementById('name').value;
    await contract.SignUp(name.toString());
}
document.getElementById('send').addEventListener('click',send);