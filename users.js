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

      // Count users and try to authenticate in background
      return App.getUserCount(), App.authenticateUser();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#isUser', App.handleUserCheck);
    $(document).on('click', '#insertUser', App.handleInsertUser);
    $(document).on('click', '#deleteUser', App.handleDeleteUser);
    $(document).on('click', '#getUserQualifications', App.handleGetUserQualifications);
    $(document).on('click', '#getUserPermissions', App.handleGetUserPermissions);
    $(document).on('click', '#updateUserQualifications', App.handleUpdateUserQualifications);
    $(document).on('click', '#updateUserPermissions', App.handleUpdateUserPermissions);
  },

  handleInsertUser: function() {
    event.preventDefault();

    console.log('Creating User');

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.insertUser({from: account});
      }).then(function(result) {
        alert('User Created!');
        return App.getUserCount();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleDeleteUser: function() {
    event.preventDefault();

    console.log('Deleting User... ');

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.deleteUser(account, {from: account});
      }).then(function(result) {
        alert('User Deleted!');
        return App.getUserCount();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleGetUserQualifications: function() {
    event.preventDefault();

    var userAddress = $('#GetUserQualificationsAddy').val();

    console.log('Getting qualifications for User ' + userAddress);

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.getUserQualifications(userAddress);
      }).then(function(result) {
        console.log(result);
        //qualifications = result.c;
        //rewardAvailable = result.c[1];
        //index = result.c[2];

        $('#ReturnUserQualifications').text(result);
        //$('#GetUserRewardAvailable').text(rewardAvailable);
        //$('#GetUserIndex').text(index);
        //$('#GetUserAddress').text(account);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleGetUserPermissions: function() {
    event.preventDefault();

    var userAddress = $('#GetUserPermissionsAddy').val();

    console.log('Getting permissions for User ' + userAddress);

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.getUserPermissions(userAddress);
      }).then(function(result) {
        console.log(result);
        //qualifications = result.c;
        //rewardAvailable = result.c[1];
        //index = result.c[2];

        $('#ReturnUserPermissions').text(result);
        //$('#GetUserRewardAvailable').text(rewardAvailable);
        //$('#GetUserIndex').text(index);
        //$('#GetUserAddress').text(account);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleUpdateUserQualifications: function() {
    event.preventDefault();

    var qualifications = parseInt($('#UpdateQualificationsValue').val());
    var userAddress = $('#UpdateQualificationsAddress').val();

    console.log('Updating Qualifications for ' + userAddress);

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.updateUserQualifications(userAddress, qualifications);
      }).then(function(result) {
        alert('User Qualifications updated');
        return App.getUserCount();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleUpdateUserPermissions: function() {
    event.preventDefault();

    var permissions = parseInt($('#UpdatePermissionsValue').val());
    var userAddress = $('#UpdatePermissionsAddress').val();

    console.log('Updating Permissions');

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.updateUserPermissions(userAddress, permissions);
      }).then(function(result) {
        alert('User Permissions updated');
        return App.getUserCount();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getUserCount: function(adopters) {
    console.log('Getting user count...');

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.getUserCount();
      }).then(function(result) {
        count = result.c[0];

        $('#GVYUserCount').text(count);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  authenticateUser: function(adopters, account) {
    console.log('Checking if user...');

    var graivyAppInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyApp.deployed().then(function(instance) {
        graivyAppInstance = instance;

        return graivyAppInstance.authenticateUser(account);
      }).then(function(result) {
        if (result == true) {
          $('#GVYUserCheck').text('Welcome back, you are logged in.');
        }
        else $('#GVYUserCheck').text('Please create a user account and login!');
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
