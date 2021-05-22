import { ethers } from "./ethers/dist/ethers.esm.min.js";
import Const from "./contract.js";
import "./node_modules/ipfs/index.min.js";
import * as _ from "./node_modules/multiformats/esm/src/index.js"


var MyContract = Const();
const abi = MyContract[0];
const address = MyContract[1];

let total;
let provider;
let ipfs;
var contract;

async function init() {
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    contract = new ethers.Contract(address, abi, provider);
    ipfs = await Ipfs.create();
}
init();

async function show(n) {
    let board = await contract.functions.ViewMarketBoard(n);
    document.getElementById(n+"_name").textContent = board[0];
    document.getElementById(n+"_price").textContent = (ethers.utils.formatEther(board[1]))+" ether";
    let id = await contract.functions.FindUserID(board[2]);
    document.getElementById(n+"_id").textContent = id;
    document.getElementById(n+"_msg").textContent = board[3];
    document.getElementById(n+"_time").textContent = board[4]+" 天";
    let picCID = _.CID.parse(board[5]).toV1().toString();
    document.getElementById(n+"_pic").setAttribute("src", "https://"+picCID+".ipfs.dweb.link");
    ipfs.pin.add(picCID);
    let msgCID = _.CID.parse(board[6]).toV1().toString();
    document.getElementById(n+"_moreMsg").setAttribute("src", "https://"+msgCID+".ipfs.dweb.link");
    ipfs.pin.add(msgCID);
}

async function send(n) {
    let board1 = await contract.functions.ViewMarketBoard(n);
    let board2;
    for(var i=0; i<1000; i++) {
        board2 = await contract.functions.FindingGoods(board1[0], i);
        if(board2[0] == board1[2]) {
            break;
        }
    }
    const signer = provider.getSigner();
    contract = new ethers.Contract(address, abi, signer);
    var addr = board2[0];
    var name =  board1[0];
    var count = board2[1];
    var bigPrice = board1[1]*2;
    var finalPrice = ethers.utils.parseEther(ethers.utils.formatEther(bigPrice.toString()));
    let overrides = {
        gasLimit: 100000,
        value: finalPrice,
    }
    await contract.Buy(addr, name.toString(), count, overrides);
}

async function AddTr() {
    var tables = document.getElementsByTagName("table");
    total = await contract.totalGoods();
    for(var i=0; i<Number(total); i++) {
        let board = await contract.functions.ViewMarketBoard(i);
        let id = await contract.functions.FindUserID(board[2]);
        var tr1 = document.createElement("tr");
        tables[0].appendChild(tr1);
        var hideRow = "showHideRow('hidden_row"+i+"');"
        tr1.setAttribute("onclick", hideRow);

        var tr2 = document.createElement("tr");
        tables[0].appendChild(tr2);
        tr2.setAttribute("id", "hidden_row"+i);
        tr2.setAttribute("class", "hidden_row");

        var td0 = document.createElement("img");
        tr1.appendChild(td0);
        td0.setAttribute("id",i+"_pic");

        var td1 = document.createElement("td");
        tr1.appendChild(td1);
        td1.setAttribute("id",i+"_name");

        var td2 = document.createElement("td");
        tr1.appendChild(td2);
        td2.setAttribute("id",i+"_price");

        var td3 = document.createElement("td");
        tr1.appendChild(td3);
        var td3_href = document.createElement("a");
        td3.appendChild(td3_href);
        td3_href.setAttribute("id",i+"_id");
        td3_href.setAttribute("href","detail.html");

        var td4 = document.createElement("td");
        tr1.appendChild(td4);
        td4.setAttribute("id",i+"_msg");

        var td5 = document.createElement("td");
        tr1.appendChild(td5);
        td5.setAttribute("id",i+"_time");
        
        var td6 = document.createElement("td");
        tr2.appendChild(td6);
        td6.setAttribute("colspan", 6);
        td6.setAttribute("id",i+"_buy");

        var msg_td = document.createElement("iframe");
        td6.appendChild(msg_td);
        msg_td.setAttribute("id",i+"_moreMsg");
        msg_td.setAttribute("width", 500);
        msg_td.setAttribute("height", 300);

        var input_td = document.createElement("input");
        td6.appendChild(input_td);
        input_td.setAttribute("class","btn");
        input_td.setAttribute("type","button");
        input_td.setAttribute("id","send"+i);
        input_td.setAttribute("value","我要購買");

        show(i);
        let url = document.getElementById(i+"_id")+"?user="+id;
        document.getElementById(i+"_id").href = url;
    };
}
AddTr();

document.getElementById("table_detail").addEventListener("click", 
    function(e){
        for(var i=0; i<Number(total); i++) {
            if(e.target.id == ("send"+i).toString()) {
                send(i);
            }
        }
    }
);

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