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