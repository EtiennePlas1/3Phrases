const TroisPhrases = artifacts.require("./TroisPhrases.sol");

contract("TroisPhrases", accounts => {
  it("devrait creer une definition", async () => {
    const troisPhrases = await TroisPhrases.deployed();
    // On cree une nouvelle definition
    await troisPhrases.createDefinition("Une definition", "un truc defini", { from: accounts[2] });

    // vote for a def
    await troisPhrases.vote(0, { from: accounts[2] });

    const definitions = await troisPhrases.definitions.call(0);
    console.log(definitions);

    let longueur = await troisPhrases.getDefinitionsLength.call()
    assert.equal(longueur, 1, "the new object wasnt stored");

    assert.equal(definitions.definition, "Une definition", "The def was not stored");

    assert.equal(definitions.defined, "un truc defini", "The defined was not stored");

    assert.equal(definitions.user, accounts[2], "The user was not stored");

    assert.equal(definitions.votes, 1, "The Votes were not stored");    

  });

  it("devrait supprimer une definition", async () => {

  const troisPhrases = await TroisPhrases.deployed();
     try {
       await troisPhrases.deleteDefinition(0, { from: accounts[0] });
     } catch (e) {
       console.error(e.reason);
       longueur = await troisPhrases.getDefinitionsLength.call();
       assert.equal(longueur, 1, "the new object was deleted");
     }

    await troisPhrases.deleteDefinition(0, { from: accounts[2] });
    longueur = await troisPhrases.getDefinitionsLength.call();
    console.log("should be 0 : " + longueur)
    assert.equal(longueur, 0, "the new object wasnt deleted");

  });

});
