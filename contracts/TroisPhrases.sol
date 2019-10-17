pragma solidity ^0.5.0;

import "./Sents.sol";

contract TroisPhrases {

  struct Definition{
    address user;
    string definition;
    string defined;
    uint256 votes;
  }

  Definition[] public definitions;



  function createDefinition(string memory definition, string memory defined) public {
    Definition memory newDefinition = Definition(msg.sender, definition, defined, 0);
    definitions.push(newDefinition);
  }

  function getDefinitionsLength() public view returns(uint256){
      return definitions.length;
  }

  function vote(uint i) public {
    definitions[i].votes += 1;
  }

 function deleteDefinition(uint index) public {
  require(index <= definitions.length,"cette definition ne figure pas dans la liste");
  require(definitions[index].user == msg.sender,"vous devez etre le createur de cette definition pour pouvoir la supprimer");

  for (uint i = index; i<definitions.length-1; i++){
    definitions[i] = definitions[i+1];
  }
  definitions.length--;
  }
}
