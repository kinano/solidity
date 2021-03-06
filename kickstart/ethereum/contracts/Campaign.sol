pragma solidity >=0.4.22 <0.6.0;

contract CampaignFactory {
    // Enables a user to deploy a new campaign contract
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimumContribution) public {
        address c = address(new Campaign(minimumContribution, msg.sender));
        deployedCampaigns.push(c);
    }
    
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    // structs define new types
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount = 0;

    constructor (uint minimumContr, address creator) public payable {
        // the global msg object has the following properties
        // data: a dictionary of key, value pairs sent with the transaction invoking the function
        // gas: the available gas for the current function invocation
        // sender: the address of the account invoking the function
        // value: The amount of ether sent along with the function invocation
        manager = creator;
        minimumContribution = minimumContr;
    }
    
    function contribute() public payable meetsMinContribution {
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    modifier meetsMinContribution() {
        require(msg.value >= minimumContribution);
        _;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    // The request r cannot be stored in storage because there is no contract level property that refers to it directly
    // For some reason, the solidity compiler makes a big deal of explicitly specifying memory as the holder for the request instance
    function createRequest(string memory description, uint value, address recipient) public restricted {
        Request memory r = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(r);
    }
    
    modifier isApprover() {
        require(approvers[msg.sender]);
        _;
    }
    
    function approveRequest(uint index) public isApprover {
        // Prevent duplicate votes
        Request storage r = requests[index]; 
        require(!r.approvals[msg.sender]);
        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage r = requests[index];
        // Make sure the request has not been completed
        require(!r.complete);
        // Make sure the request has enough approvers
        require(r.approvalCount >= (approversCount / 2) );
        r.complete = true;
        r.recipient.transfer(r.value);
    }

    function getSummary() public view returns (
        uint,
        uint,
        uint,
        uint,
        address
    ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }

}