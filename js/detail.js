import { ethers } from "./ethers/dist/ethers.esm.min.js";
import Const from "./contract.js";


var MyContract = Const();
const abi = MyContract[0];
const address = MyContract[1];

let provider;
var contract;

async function init() {
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    contract = new ethers.Contract(address, abi, provider);
}
init();

let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('user');
let addr;
let total;

async function showTable(n) {
    let board = await contract.functions. ViewPublicBoard(addr.toString(), n);
    document.getElementById(n+'_name').textContent = board[0];
    document.getElementById(n+'_price').textContent = (ethers.utils.formatEther(board[1]))+" ether";
    document.getElementById(n+'_msg').textContent = board[4];
    document.getElementById(n+'_time').textContent = board[5]+" 天";
}

async function show() {
    addr = await contract.functions.FindUserAddr(id);
    let return_rec = await contract.functions.CheckUserRec(addr.toString(), "seller");
    let rec = (return_rec[0]*100)/return_rec[1];
    rec = rec.toFixed(2);
    document.getElementById('user_name').textContent ="暱稱: "+id;
    document.getElementById('rec').textContent ="評價: "+rec+" %";
}
show();

async function send(n) {
    addr = await contract.functions.FindUserAddr(id);
    let board1 = await contract.functions. ViewPublicBoard(addr.toString(), n);
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
        gasLimit: 3000000,
        value: finalPrice,
    }
    await contract.Buy(addr, name.toString(), count, overrides);
}

async function AddTr() {
    addr = await contract.functions.FindUserAddr(id);
    var tables = document.getElementsByTagName('table');
    total = await contract.functions.ViewCount("Pseller", addr.toString());
    for(var i=0; i<Number(total); i++) {
        var tr1 = document.createElement('tr');
        tables[0].appendChild(tr1);
        var hideRow = "showHideRow('hidden_row"+i+"');"
        tr1.setAttribute("onclick", hideRow);

        var tr2 = document.createElement('tr');
        tables[0].appendChild(tr2);
        tr2.setAttribute("id", "hidden_row"+i);
        tr2.setAttribute("class", "hidden_row");

        var td1 = document.createElement('td');
        tr1.appendChild(td1);
        td1.setAttribute("id",i+'_name');

        var td2 = document.createElement('td');
        tr1.appendChild(td2);
        td2.setAttribute("id",i+'_price');

        var td3 = document.createElement('td');
        tr1.appendChild(td3);
        td3.setAttribute("id",i+'_msg');

        var td4 = document.createElement('td');
        tr1.appendChild(td4);
        td4.setAttribute("id",i+'_time');

        var td5 = document.createElement('td');
        tr2.appendChild(td5);
        td5.setAttribute("colspan", 4);
        td5.setAttribute("id",i+'_buy');

        var input_td = document.createElement('input');
        td5.appendChild(input_td);
        input_td.setAttribute("class",'btn');
        input_td.setAttribute("type",'button');
        input_td.setAttribute("id",'send'+i);
        input_td.setAttribute("value","我要購買");

        showTable(i);
    };
}
AddTr();

document.getElementById('table_detail').addEventListener('click', 
    function(e){
        for(var i=0; i<Number(total); i++) {
            if(e.target.id == ('send'+i).toString()) {
                send(i);
            }
        }
    }
);