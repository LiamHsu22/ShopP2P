import { ethers } from "../js/ethers/dist/ethers.esm.min.js";
import Const from "./contract.js";
import * as _ from "./node_modules/multiformats/esm/src/index.js"


var MyContract = Const();
const abi = MyContract[0];
const address = MyContract[1];

let signer;
let provider;
var contract;

async function init() {
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    signer = provider.getSigner();
    contract = new ethers.Contract(address, abi, signer);
}
init();

async function showName() {
    let addr = await signer.getAddress();
    let return_rec = await contract.functions.CheckUserRec(addr.toString(), "seller");
    let id = await contract.functions.FindUserID(addr);
    let rec = (return_rec[0]*100)/return_rec[1];
    let recStd = return_rec[2];
    rec = rec.toFixed(2);
    document.getElementById("user_name").textContent ="暱稱: "+id;
    document.getElementById("rec").textContent ="評價: "+rec+" %";
    document.getElementById("rec_std").textContent ="標準: "+recStd+" %";
}
showName();

async function changeRec(user) {
    let addr = await signer.getAddress();
    let return_rec = await contract.functions.CheckUserRec(addr.toString(), user);
    let rec = (return_rec[0]*100)/return_rec[1];
    let recStd = return_rec[2];
    rec = rec.toFixed(2);
    document.getElementById("rec").textContent ="評價: "+rec+" %";
    document.getElementById("rec_std").textContent ="標準: "+recStd+" %";
}

document.getElementById("#tab01").addEventListener("click", 
    function(e){
        if(e.target.id == "#tab01")
            changeRec("seller");
    });
document.getElementById("#tab02").addEventListener("click",
    function(e){
        if(e.target.id == "#tab02")
            changeRec("buyer");
    });

async function show(user, n) {
    let board;
    let id;
    let addr = await signer.getAddress();
    if(user == "seller"){
        board = await contract.functions.ViewSellerBoard(addr, n);
        id = await contract.functions.FindUserID(board[2][0]);
    }
    else {
        board = await contract.functions.ViewBuyerBoard(addr, n);
        id = await contract.functions.FindUserID(board[2][1]);
    }
    document.getElementById(n+"_name_"+user).textContent = board[0];
    document.getElementById(n+"_price_"+user).textContent = (ethers.utils.formatEther(board[1]))+" ether";
    document.getElementById(n+"_id_"+user).textContent = id;
    document.getElementById(n+"_msg_"+user).textContent = board[3];
    var date = new Date(parseInt(board[4])*1000);
    document.getElementById(n+"_time_"+user).textContent =
    date.getFullYear()+
    "/"+(date.getMonth()+1)+
    "/"+date.getDate()+
    " "+date.getHours()+
    ":"+(date.getMinutes()+1);

    let picCID = _.CID.parse(board[5][0]).toV1().toString();
    document.getElementById(n+"_pic_"+user).setAttribute("src", "https://"+picCID+".ipfs.dweb.link");
    let msgCID = _.CID.parse(board[5][1]).toV1().toString();
    document.getElementById(n+"_moreMsg_"+user).setAttribute("src", "https://"+msgCID+".ipfs.dweb.link");
    let url = document.getElementById(n+"_id_"+user)+"?user="+id;
    document.getElementById(n+"_id_"+user).href = url;
}

async function buy_deal(n, flag) {
    const signer = provider.getSigner();
    contract = new ethers.Contract(address, abi, signer);
    let user_addr = await signer.getAddress();
    let board = await contract.functions.ViewBuyerBoard(user_addr, n);
    var name =  board[0];
    var price = ethers.utils.parseEther("0");
    let overrides = {
        gasLimit: 1000000,
        value: price,
    }

    if(flag == 0) {
        await contract.Deal(name, n, overrides);
    }
    else if(flag == 1) {
        await contract.NotDeal(name, n, overrides);
    }
    else if(flag == 2) {
        await contract.ForceDeal(name, n, overrides);
    }
}

async function sell_feedback(n, flag) {
    const signer = provider.getSigner();
    contract = new ethers.Contract(address, abi, signer);
    let user_addr = await signer.getAddress();
    let board = await contract.functions.ViewSellerBoard(user_addr, n);
    var name =  board[0];
    var price = ethers.utils.parseEther("0");
    let overrides = {
        gasLimit: 1000000,
        value: price,
    }

    if(flag == 0) {
        await contract.PosFeedback(name, n, overrides);
    }
    else if(flag == 1) {
        await contract.NegFeedback(name, n, overrides);
    }
}

function AddTr(total, user, detail) {
    var tables = document.getElementById(detail);
    for(var i=0; i < Number(total); i++) {
        
        var tr1 = document.createElement("tr");
        tables.appendChild(tr1);
        var hideRow = "showHideRow('hidden_row"+i+user+"');"
        tr1.setAttribute("onclick", hideRow);

        var tr2 = document.createElement("tr");
        tables.appendChild(tr2);
        tr2.setAttribute("id", "hidden_row"+i+user);
        tr2.setAttribute("class", "hidden_row");

        var td0 = document.createElement("img");
        tr1.appendChild(td0);
        td0.setAttribute("id",i+"_pic_"+user);

        var td1 = document.createElement("td");
        tr1.appendChild(td1);  
        td1.setAttribute("id",i+"_name_"+user);

        var td2 = document.createElement("td");
        tr1.appendChild(td2);
        td2.setAttribute("id",i+"_price_"+user);

        var td3 = document.createElement("td");
        tr1.appendChild(td3);
        var td3_href = document.createElement("a");
        td3.appendChild(td3_href);
        td3_href.setAttribute("id",i+"_id_"+user);
        td3_href.setAttribute("href","detail.html");

        var td4 = document.createElement("td");
        tr1.appendChild(td4);
        td4.setAttribute("id",i+"_msg_"+user);

        var td5 = document.createElement("td");
        tr1.appendChild(td5);
        td5.setAttribute("id",i+"_time_"+user);

        var td6 = document.createElement("td");
        tr2.appendChild(td6);
        td6.setAttribute("colspan", 6);
        td6.setAttribute("id",i+"_buy");

        var msg_td = document.createElement("iframe");
        td6.appendChild(msg_td);
        msg_td.setAttribute("id",i+"_moreMsg_"+user);
        msg_td.setAttribute("width", 500);
        msg_td.setAttribute("height", 300);

        var br = document.createElement("br");
        td6.appendChild(br);

        var input_td1 = document.createElement("input");
        td6.appendChild(input_td1);
        input_td1.setAttribute("class","btn btn1");
        input_td1.setAttribute("type","button");
        input_td1.setAttribute("id","pos"+i+"_"+user);
        input_td1.setAttribute("value","好評");

        if(user == "buyer") {
            var input_td3 = document.createElement("input");
            td6.appendChild(input_td3);
            input_td3.setAttribute("class","btn btn3");
            input_td3.setAttribute("type","button");
            input_td3.setAttribute("id","force"+i+"_"+user);
            input_td3.setAttribute("value","強制取回押金");
        }
        
        var input_td2 = document.createElement("input");
        td6.appendChild(input_td2);
        input_td2.setAttribute("class","btn btn2");
        input_td2.setAttribute("type","button");
        input_td2.setAttribute("id","neg"+i+"_"+user);
        input_td2.setAttribute("value","差評");
    }
}

async function showTable() {
    let addr = await signer.getAddress();
    let seller_total = await contract.functions.ViewCount("seller", addr);
    let buyer_total = await contract.functions.ViewCount("buyer", addr);

    AddTr(seller_total, "seller", "table_detail1");
    AddTr(buyer_total, "buyer", "table_detail2");
    
    for(var i=0; i < Number(seller_total); i++) {
        show("seller", i);
    }
    for(var i=0; i < Number(buyer_total); i++) {
        show("buyer", i);
    }

    document.getElementById("table_detail1").addEventListener("click", 
        function(e){
            for(var i=0; i<Number(seller_total); i++) {
                if(e.target.id == ("pos"+i+"_seller").toString()) {
                    sell_feedback(i, 0);
                }
                if(e.target.id == ("neg"+i+"_seller").toString()) {
                    sell_feedback(i, 1);
                }
            }
        }
    );

    document.getElementById("table_detail2").addEventListener("click", 
        function(e){
            for(var i=0; i<Number(buyer_total); i++) {
                if(e.target.id == ("pos"+i+"_buyer").toString()) {
                    buy_deal(i, 0);
                }
                if(e.target.id == ("neg"+i+"_buyer").toString()) {
                    buy_deal(i, 1);
                }
                if(e.target.id == ("force"+i+"_buyer").toString()) {
                    buy_deal(i, 2);
                }
            }
        }
    );
}
showTable();