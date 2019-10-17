pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract Sents is ERC20 {

string public name = "Sents";
string public symbol = "SE";
uint8 public decimals = 2;
uint public INITIAL_SUPPLY = 12000;

}