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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
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
    $(document).on('keyup', '.rechercheDef', App.rechercheDef);
  },

  displayDefinitions: async function() {

    const troisPhrases = await App.contracts.TroisPhrases.deployed();
    const defLength = await troisPhrases.getDefinitionsLength.call();
    console.log("defLength : " + defLength)
    $("#defsRow").empty();
    for (var i = 0; i < defLength; i++) {
      App.displayDefByIndex(i, troisPhrases);
    }
  },

  displayDefByIndex: async function(index, contract){
    let defsRow = $('#defsRow');
    let defTemplate = $('#defTemplate');
    const definition = await contract.definitions.call(index);
    console.log("def : " + definition);
    defTemplate.find('.panel-def').attr('data-id', 'def-'+index);
    defTemplate.find('.defined').text(definition[2]);
    defTemplate.find('.defined').attr('data-id', 'defined-'+index);
    defTemplate.find('.user').text(definition[0]);
    defTemplate.find('.definition').text(definition[1]);
    defTemplate.find('.votes').text(definition[3]);
    defTemplate.find('.votes').attr('data-id', 'vote-'+index);
    defTemplate.find('.btn-vote').attr('data-id', index);
    defTemplate.find('.btn-suppr').attr('data-id', index);
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
      App.displayDefByIndex(defLength-1, troisPhrases);
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
      }).then(()=>{App.displayDefinitions();})
      .catch(function(err) {
    console.log(err.message);
  });
    });

  },

  rechercheDef : async function(){
    const troisPhrases = await App.contracts.TroisPhrases.deployed();
    const defLength = await troisPhrases.getDefinitionsLength.call();
    let input = $(".rechercheDef").val().toUpperCase();
    for (let index = 0; index < defLength; index++) {
      console.log($('[data-id="defined-'+index+'"]').text());
      console.log(input);
      if (!$('[data-id="defined-'+index+'"]').text().toUpperCase().includes(input)){
        $('[data-id="def-'+index+'"]').css("display", "none");
      } else {
        $('[data-id="def-'+index+'"]').css("display", "");
      }
      
    }
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
