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
  },

  displayDefinitions: async function(adopters, account) {

    const troisPhrases = await App.contracts.TroisPhrases.deployed();
    const defLength = await troisPhrases.getDefinitionsLength.call();

if(defLength != 0){
      let defsRow = $('#defsRow');
      let defTemplate = $('#defTemplate');
      let definitionAffichage;
      const definition = await troisPhrases.definitions.call(defLength-1);
      defTemplate.find('.defined').text(definition.defined);
      defTemplate.find('.user').text(definition.user);
      defTemplate.find('.definition').text(definition.definition);
      defTemplate.find('.votes').text(definition.votes);
      defTemplate.find('.btn-vote').attr('data-id', defLength-1);
      defsRow.append(defTemplate.html());
      }

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
      App.displayDefinitions();
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
      App.displayDefinitions();
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
