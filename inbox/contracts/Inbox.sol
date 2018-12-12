pragma solidity >=0.4.22 <0.6.0;

contract Inbox {
    string public message;
    constructor (string memory initialMsg) public {
        message = initialMsg;
    }    
    function setMessage(string memory newMsg) public {
        message = newMsg;
    }
}