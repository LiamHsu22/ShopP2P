import { ethers } from "../js/ethers/dist/ethers.esm.min.js";
import Const from "./contract.js";


var MyContract = Const();
const abi = MyContract[0];
const address = MyContract[1];

let provider;
var unit;
var bool;

async function init() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    unit = "gwei";
    bool = false;
}
init();

function UnitEth() {
    document.getElementById('unit').textContent = "ether";
    unit = "ether";
    bool = true;
}
document.getElementById('eth').addEventListener('click',UnitEth);

function UnitWei() {
    document.getElementById('unit').textContent = "gwei";
    unit="gwei";
    bool = false;
}
document.getElementById('gwei').addEventListener('click',UnitWei);


async function send() {
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    const signer = provider.getSigner();
    var contract = new ethers.Contract(address, abi, signer);
    var name = document.getElementById('name').value;
    var price = Number(document.getElementById('price').value);
    var msg = document.getElementById('msg').value;
    var time =  Number(document.getElementById('time').value);
    var finalPrice;
    if(bool) {
        finalPrice = ethers.utils.parseEther((price*2).toString());
    }
    else {
        finalPrice = ethers.utils.parseEther(((price/1000000000)*2).toString())
    }
    let overrides = {
        gasLimit: 3000000,
        value: finalPrice,
    }
    await contract.Sell(name.toString(),price,unit.toString(),msg.toString(),time, overrides);
}
document.getElementById('send').addEventListener('click',send);