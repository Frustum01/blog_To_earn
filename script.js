const CONTRACT_ADDRESS = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8"; 

const ABI = [ 
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "blogId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "action",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			}
		],
		"name": "Engagement",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "blogId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "action",
				"type": "string"
			}
		],
		"name": "engageWithBlog",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fundContract",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newReward",
				"type": "uint256"
			}
		],
		"name": "updateReward",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawal",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "withdrawRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "blogEngagement",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardPerEngagement",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider, signer, contract;

async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

            const address = await signer.getAddress();
            document.getElementById("walletAddress").innerText = `Connected: ${address}`;
            getBalance();
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("MetaMask not detected!");
    }
}

async function getBalance() {
    try {
        const balance = await contract.userBalance(await signer.getAddress());
        document.getElementById("balance").innerText = ethers.utils.formatEther(balance);
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

async function engageWithBlog() {
    const blogId = document.getElementById("blogId").value;
    const action = document.getElementById("action").value;

    if (!blogId || !action) {
        alert("Enter a valid Blog ID and Action!");
        return;
    }

    try {
        const tx = await contract.engageWithBlog(blogId, action);
        await tx.wait();
        alert("Engagement successful!");
        getBalance();
    } catch (error) {
        console.error("Engagement failed:", error);
    }
}

async function withdrawRewards() {
    try {
        const tx = await contract.withdrawRewards();
        await tx.wait();
        alert("Withdrawal successful!");
        getBalance();
    } catch (error) {
        console.error("Withdrawal failed:", error);
    }
}

async function updateReward() {
    const newReward = document.getElementById("newReward").value;
    if (!newReward) {
        alert("Enter a valid reward amount!");
        return;
    }

    try {
        const tx = await contract.updateReward(newReward);
        await tx.wait();
        alert("Reward updated!");
    } catch (error) {
        console.error("Reward update failed:", error);
    }
}

async function fundContract() {
    const fundAmount = document.getElementById("fundAmount").value;
    if (!fundAmount) {
        alert("Enter a fund amount!");
        return;
    }

    try {
        const tx = await signer.sendTransaction({
            to: CONTRACT_ADDRESS,
            value: ethers.utils.parseEther(fundAmount),
        });
        await tx.wait();
        alert("Contract funded!");
    } catch (error) {
        console.error("Funding failed:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("connectWallet").addEventListener("click", connectWallet);
    document.getElementById("engageBtn").addEventListener("click", engageWithBlog);
    document.getElementById("withdrawBtn").addEventListener("click", withdrawRewards);
    document.getElementById("updateRewardBtn").addEventListener("click", updateReward);
    document.getElementById("fundContractBtn").addEventListener("click", fundContract);
});

