import { ethers } from "./ethers/dist/ethers.esm.min.js";
import Const from "./contract.js";
import "./node_modules/ipfs/index.min.js";

var MyContract = Const();
const abi = MyContract[0];
const address = MyContract[1];

let provider;
let ipfs;
var contract;

async function init() {
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    contract = new ethers.Contract(address, abi, provider);
    ipfs = await Ipfs.create();
}
init();

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