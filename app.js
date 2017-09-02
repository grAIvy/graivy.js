App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('GraivyApp.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var GraivyAppArtifact = data;
      App.contracts.GraivyApp = TruffleContract(GraivyAppArtifact);

      // Set the provider for our contract.
      App.contracts.GraivyApp.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#updateTokenAddress', App.handleUpdateTokenAddress);
  },

  handleUpdateTokenAddress: function() {
    event.preventDefault();

    var tokenAddress = $('#TokenAddress').val();

    console.log('Updating token address...');

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.updateTokenAddress(tokenAddress, {from: account});
      }).then(function(result) {
        alert('Token Address Updated!');
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
