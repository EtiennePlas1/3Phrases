App = {
  web3Provider: null,
  contracts: {},

  init: async function() {

    return await App.initWeb3();
  },

  initWeb3: async function() {

    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {

    $.getJSON('TroisPhrases.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var TroisPhrasesArtifact = data;
      App.contracts.TroisPhrases = TruffleContract(TroisPhrasesArtifact);

      // Set the provider for our contract
      App.contracts.TroisPhrases.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.displayDefinitions();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-vote', App.voteForDef);
    $(document).on('click', '.btn-add-def', App.addDefinition);
    $(document).on('click', '.btn-suppr', App.supprDefinition);
  },

  displayDefinitions: async function() {

    const troisPhrases = await App.contracts.TroisPhrases.deployed();
    const defLength = await troisPhrases.getDefinitionsLength.call();
    console.log("defLength : " + defLength)
    $("#defsRow").empty();
    for (var i = 0; i < defLength; i++) {
      App.displayDefById(i, troisPhrases);
    }
  },

  displayDefById: async function(id, contract){
    let defsRow = $('#defsRow');
    let defTemplate = $('#defTemplate');
    let definitionAffichage;
    const definition = await contract.definitions.call(id);
    console.log("def : " + definition);
    defTemplate.find('.panel-def').attr('data-id', 'def-'+id);
    defTemplate.find('.defined').text(definition[2]);
    defTemplate.find('.user').text(definition[0]);
    defTemplate.find('.definition').text(definition[1]);
    defTemplate.find('.votes').text(definition[3]);
    defTemplate.find('.votes').attr('data-id', 'vote-'+id);
    defTemplate.find('.btn-vote').attr('data-id', id);
    defTemplate.find('.btn-suppr').attr('data-id', id);
    defsRow.append(defTemplate.html());
  },

  updateVoteDisplayById: async function(id){
    const troisPhrases = await App.contracts.TroisPhrases.deployed();
    const definition = await troisPhrases.definitions.call(id);
    $('[data-id="vote-'+id+'"]').text(definition[3]);

  },

  voteForDef: async function(event) {
    event.preventDefault();
    let defId = parseInt($(event.target).data('id'));
    web3.eth.getAccounts(async function(error, accounts) {
      if (error) {
        console.log(error);
      }
      const troisPhrases = await App.contracts.TroisPhrases.deployed();
      await troisPhrases.vote(defId, {
        from: accounts[0]
      });
      App.updateVoteDisplayById(defId);
    });

  },

  addDefinition: async function() {
    let addedDefined = $('#addedDefined').val();
    let addedDefinition = $('#addedDefinition').val();
    web3.eth.getAccounts(async function(error, accounts) {
      if (error) {
        console.log(error);
      }
      const troisPhrases = await App.contracts.TroisPhrases.deployed();
      await troisPhrases.createDefinition(addedDefinition, addedDefined, { from: accounts[0] });
      const defLength = await troisPhrases.getDefinitionsLength.call();
      App.displayDefById(defLength-1, troisPhrases);
    });
  },

  supprDefinition : async function(event){
    let defId = parseInt($(event.target).data('id'));
    web3.eth.getAccounts(async function(error, accounts) {
      if (error) {
        console.log(error);
      }
      const troisPhrases = await App.contracts.TroisPhrases.deployed();
      await troisPhrases.deleteDefinition(defId, {
        from: accounts[0]
      }).then(()=>{App.displayDefinitions();});
    });

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
