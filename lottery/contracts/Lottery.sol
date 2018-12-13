pragma solidity >=0.4.22 <0.6.0;

contract Lottery {
    address public manager;
    address [] public players;

    constructor () public payable {
        // the global msg object has the following properties
        // data: a dictionary of key, value pairs sent with the transaction invoking the function
        // gas: the available gas for the current function invocation
        // sender: the address of the account invoking the function
        // value: The amount of ether sent along with the function invocation
        manager = msg.sender;
    }
    
    function enter() public payable {
        // the require() function is a global validation function
        require(msg.value >= .001 ether);
        players.push(msg.sender);
    }
    
    function pickWinner() public payable restricted {
        // Determine the winner's index
        uint index = random() % players.length;
        // Get the current contract's balance and send it to the winner
        players[index].transfer(address(this).balance);
        resetLottery();
    }
    
    function resetLottery() private {
        players = new address[](0);
    }
    
    modifier restricted() {
        // Only certain users can call a function modified by modifier
        require(msg.sender == manager);
        // The _ effectively gets replaced with the calling function body
        _;
    }
    
    function random() private view returns (uint) {
        // Use the current block difficulty to generate a random number
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }
    
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
    
}