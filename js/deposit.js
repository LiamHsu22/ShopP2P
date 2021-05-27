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

async function sendToken() {
    const signer = provider.getSigner();
    var contract = new ethers.Contract(address, abi, signer);
    var num = document.getElementById("dep").value;
    await contract.BuyCredits(num);
}
document.getElementById("add-credits").addEventListener("click",sendToken);

async function transfer() {
    const signer = provider.getSigner();
    var contract = new ethers.Contract(address, abi, signer);
    var addr = document.getElementById("address").value;
    var num = document.getElementById("number").value;
    await contract.transfer(addr, num);
}
document.getElementById("transfer-to").addEventListener("click",transfer);

function mining() {
    if(localStorage.getItem("mining") == "false") {
        localStorage.setItem("mining", "true");
        document.getElementById("state").textContent = "目前設定: 開啟"
        document.getElementById("mining-send").value = "關閉挖礦"
    }
    else if(localStorage.getItem("mining") == "true") {
        localStorage.setItem("mining", "false");
        document.getElementById("state").textContent = "目前設定: 關閉"
        document.getElementById("mining-send").value = "開啟挖礦"
    }
}
if(localStorage.getItem("mining") == "false") {
    document.getElementById("state").textContent = "目前設定: 關閉"
    document.getElementById("mining-send").value = "開啟挖礦"
}
else if(localStorage.getItem("mining") == "true") {
    document.getElementById("state").textContent = "目前設定: 開啟"
    document.getElementById("mining-send").value = "關閉挖礦"
}

document.getElementById("mining-send").addEventListener("click",mining);

async function autoMining() {
    const signer = provider.getSigner();
    var contract = new ethers.Contract(address, abi, signer);
    var bool = true;
    async function getTime() {
        let time = await contract.basicTime();
        let now = Math.floor(Date.now()/1000);
        if((now >= Number(time)) && (now <= Number(time)+60) && (bool == true)) {
            let overrides = {
                gasLimit: 1000000
            }
            await contract.functions.Mining(overrides);
            bool = false;
            console.log("pause:");
            console.log(now);
        }
        else {
            if(now > Number(time)+60)
                bool = true;
            console.log("now:");
            console.log(now);
        }
        if(localStorage.getItem("mining") == "true")
            window.setTimeout(getTime,1000); 
    }
    getTime();
}
autoMining();