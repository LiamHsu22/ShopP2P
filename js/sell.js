import { ethers } from "../js/ethers/dist/ethers.esm.min.js";
import Const from "./contract.js";
import "./node_modules/ipfs/index.min.js";

var MyContract = Const();
const abi = MyContract[0];
const address = MyContract[1];


let provider;
let ipfs;
var unit;
var bool;
let picCID;
let msgCID;

async function init() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    unit = "gwei";
    bool = false;
    ipfs = await Ipfs.create();
}
init();

function UnitEth() {
    document.getElementById("unit").textContent = "ether";
    unit = "ether";
    bool = true;
}
document.getElementById("eth").addEventListener("click",UnitEth);

function UnitWei() {
    document.getElementById("unit").textContent = "gwei";
    unit="gwei";
    bool = false;
}
document.getElementById("gwei").addEventListener("click",UnitWei);

async function sendPic() {
    let picture = document.getElementById("pic");
    
    const reader = new FileReader;
    var fileBuffer;
    let resultValue;
    reader.readAsArrayBuffer(picture.files[0]);
    reader.onload = function() {
        var arrayBuffer = reader.result;
        fileBuffer = new Uint8Array(arrayBuffer);
        resultValue = ipfs.add(fileBuffer, {
            progress: (prog) => console.log(`received: ${prog}`),
          }).then((result) => {
            return result.path;
        });
        const toCID = async () => {
            picCID = await resultValue;
            document.getElementById("hashPic").textContent = "hash:" + picCID;
        };
        toCID();
    }
    document.getElementById("sendPic").value = "更改圖片";
}

async function sendMsg() {
    let message = document.getElementById("more-msg");
    var textBlob = new Blob([message.value], {
        type: 'text/plain'
    });
    const reader = new FileReader;
    let resultValue;
    reader.readAsText(textBlob);
    reader.onload = function() {
        var textBuffer = reader.result;
        resultValue = ipfs.add(textBuffer, {
            progress: (prog) => console.log(`received: ${prog}`),
          }).then((result) => {
            return result.path;
        });
        const toCID = async () => {
            msgCID = await resultValue;
            document.getElementById("hashMsg").textContent = "hash:" + msgCID;
        };
        toCID();
    }
    document.getElementById("sendMsg").value = "更改詳情";
}

async function send() {
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    const signer = provider.getSigner();
    var contract = new ethers.Contract(address, abi, signer);
    var name = document.getElementById("name").value;
    var price = Number(document.getElementById("price").value);
    var msg = document.getElementById("msg").value;
    var time =  Number(document.getElementById("time").value);
    var finalPrice;
    if(bool) {
        finalPrice = ethers.utils.parseEther((price*2).toString());
    }
    else {
        finalPrice = ethers.utils.parseEther(((price/100000000)*2).toString())
    }
    let overrides = {
        gasLimit: 100000,
        value: finalPrice,
    }
    ipfs.pin.add(picCID, { recursive:true });
    ipfs.pin.add(msgCID, { recursive:true });
    await contract.Sell(name.toString(),price,unit.toString(),msg.toString(),time, picCID.toString(), msgCID.toString(), overrides);
}
document.getElementById("sendPic").addEventListener("click",sendPic);
document.getElementById("sendMsg").addEventListener("click",sendMsg);
document.getElementById("send").addEventListener("click",send);

async function autoMining() {
    const signer = provider.getSigner();
    var contract = new ethers.Contract(address, abi, signer);
    var bool = true;
    async function getTime() {
        let time = await contract.basicTime();
        let now = Math.floor(Date.now()/1000);
        if((now >= Number(time)) && (now <= Number(time)+60) && (bool == true)) {
            let overrides = {
                gasLimit: 100000
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