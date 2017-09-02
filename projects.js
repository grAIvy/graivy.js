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

      // Use our contract to retieve and mark the adopted pets.
      return App.getProjectCount();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#isProject', App.handleProjectCheck);
    $(document).on('click', '#insertProject', App.handleInsertProject);
    $(document).on('click', '#deleteProject', App.handleDeleteProject);
    $(document).on('click', '#getNumTasks', App.handleGetProjectNumTasks);
  },

  handleInsertProject: function() {
    event.preventDefault();

    var projectAddress = $('#ProjectAddress').val();
    var owner = $('#ProjectOwner').val();
    var qualifications = parseInt($('#ProjectQualifications').val());
    var redundancy = parseInt($('#ProjectRedundancy').val());
    var tasksLocation = $('#ProjectTasksLocation').val();
    var numTasks = parseInt($('#ProjectNumTasks').val());
    var rewardTotal = parseFloat($('#ProjectRewardTotal').val());
    var results = $('#ProjectResults').val();

    console.log('Creating Project...');

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.insertProject(
          projectAddress,
          owner,
          qualifications,
          redundancy,
          tasksLocation,
          numTasks,
          rewardTotal,
          results
        );
      }).then(function(result) {
        alert('Project Created!');
        return App.getProjectCount();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleDeleteProject: function() {
    event.preventDefault();

    var projectAddress = $('#DeleteProjectAddress').val();

    console.log('Deleting Project... ');

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.deleteProject(projectAddress, {from: account});
      }).then(function(result) {
        alert('Project Deleted!');
        return App.getProjectCount();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleGetProjectNumTasks: function() {
    event.preventDefault();

    var projectAddress = $('#GetNumTasksAddy').val();

    console.log('Getting info for Project');

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.getProjectNumTasks(projectAddress);
      }).then(function(result) {
        console.log(result);

        $('#ProjectNumTasksReturned').text(result);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleProjectCheck: function() {
    event.preventDefault();

    var projectAddress = $('#UpdateQualificationsAddress').val();

    console.log('Checking if project: ' + userAddress);

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.isProject(projectAddress);
      }).then(function(result) {
        $('#IsProjectCheck').text(result);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getProjectCount: function(adopters) {
    console.log('Getting project count...');

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.getProjectCount();
      }).then(function(result) {
        count = result.c[0];

        $('#GVYProjectCount').text(count);
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
