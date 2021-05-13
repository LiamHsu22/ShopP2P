var web3 = new Web3(window.web3.currentProvider);

var Contract;
var abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "editMessage",
                "type": "string"
            }
        ],
        "name": "editMessage",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "initMessage",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "message",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "viewMessage",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]
var address = '0xeFd35a0c1b6B7dc083C290123f132C4A1477eBaA';
async function init() {
    Contract = await new web3.eth.Contract(abi, address);

    Contract.methods.viewMessage().call()
        .then(function (data) {
            document.getElementById('message').textContent = data;
        })
}
init();
async function send() {
    var accounts = await web3.eth.getAccounts();
    var str = document.getElementById('editMessage').value;
    Contract.methods.editMessage(str)
        .send({ from: accounts[0] })
        .then(function (data) {
            console.log(data);
        })

}
document.getElementById('send').addEventListener('click', send);