import { ethers } from "../js/ethers/dist/ethers.esm.min.js";

let provider;
const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"_editMessage","type":"string"}],"name":"editMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"message","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"viewMessage","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]
const address = '0x522cf3eD6e203B17c5455F716ed2b6cfC497c470';


async function init() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    var contract = new ethers.Contract(address, abi, provider);
    let callMessage = await contract.functions.viewMessage();
    let callMessage2 = await contract.message();
    document.getElementById('message').textContent = callMessage;
    document.getElementById('message2').textContent = callMessage2;
}
init();

async function send() {
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    const signer = provider.getSigner();
    var contract = new ethers.Contract(address, abi, signer);
    var str = document.getElementById('editMessage').value;
    contract.functions.editMessage(str);
}
document.getElementById('send').addEventListener('click', send);