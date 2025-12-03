// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FoodCommerce {
    struct Order {
        address customer;
        uint total;
        string ipfsHash;
        uint256 timestamp;
    }

    Order[] public orders;

    event OrderCreated(address indexed customer, uint total, string ipfsHash, uint256 timestamp);

    function createOrder(address _customer, uint _total, string memory _ipfsHash) public {
        require(_customer != address(0), "Customer address cannot be zero");
        require(_total > 0, "Order total must be greater than zero");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");

        orders.push(Order({
            customer: _customer,
            total: _total,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp
        }));

        emit OrderCreated(_customer, _total, _ipfsHash, block.timestamp);
    }

    function getOrders() public view returns (Order[] memory) {
        return orders;
    }
}
