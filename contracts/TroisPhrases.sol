pragma solidity ^0.5.0;

contract TroisPhrases {

  struct Definition{
    address user;
    string definition;
    string defined;
    uint256 votes;
  }

  Definition[] public definitions;

  function createDefinition(string memory definition, string memory defined) public {
    Definition memory newDefinition = Definition(msg.sender, definition , defined, 0);
    definitions.push(newDefinition);
  }

  function getDefinitionsLength() public view returns(uint256){
      return definitions.length;
  }

  function vote(uint i) public {
    definitions[i].votes+=1;
  }

}
