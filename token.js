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
    $.getJSON('GraivyToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var GraivyTokenArtifact = data;
      App.contracts.GraivyToken = TruffleContract(GraivyTokenArtifact);

      // Set the provider for our contract.
      App.contracts.GraivyToken.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getBalances(), App.checkLock(), App.releaseTime(), App.getTimestamp();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#mintButton', App.handleMint);
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#claimButton', App.handleClaim);
    $(document).on('click', '#unlockButton', App.handleUnlock);
    $(document).on('click', '#checklockButton', App.handleCheckLock);
    $(document).on('click', '#checkreleaseButton', App.handleReleaseTime);
    $(document).on('click', '#approvalButton', App.handleApproval);
  },

  handleMint: function() {
    event.preventDefault();

    var amount = parseFloat($('#GVYMintAmount').val());
    var toAddress = $('#GVYMintAddress').val();

    console.log('Minting ' + amount + ' Ether to Graivy for ' + toAddress);

    var graivyTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyToken.deployed().then(function(instance) {
        graivyTokenInstance = instance;

        return graivyTokenInstance.mint(toAddress, {from: account, value: web3.toWei(amount, 'ether')});
      }).then(function(result) {
        alert('Minting Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleTransfer: function() {
    event.preventDefault();

    var amount = parseInt($('#GVYTransferAmount').val());
    var toAddress = $('#GVYTransferAddress').val();

    console.log('Transfer ' + amount + ' GVY to ' + toAddress);

    var graivyTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyToken.deployed().then(function(instance) {
        graivyTokenInstance = instance;

        return graivyTokenInstance.transfer(toAddress, amount, {from: account});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleApproval: function() {
    event.preventDefault();

    var amount = parseFloat($('#GVYApprovalAmount').val());
    var spender = $('#GVYApprovalAddress').val();

    console.log('Approving ' + amount + ' GVY for ' + spender);

    var graivyTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyToken.deployed().then(function(instance) {
        graivyTokenInstance = instance;

        return graivyTokenInstance.approve(spender, amount, {from: account});
      }).then(function(result) {
        alert('Approval Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleClaim: function() {
    event.preventDefault();

    var amount = parseInt($('#GVYClaimAmount').val());

    console.log('Claiming ' + amount + ' GVY for ether');

    var graivyTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyToken.deployed().then(function(instance) {
        graivyTokenInstance = instance;

        return graivyTokenInstance.claim(amount, {from: account});
      }).then(function(result) {
        alert('Claim Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleUnlock: function() {
    event.preventDefault();

    console.log('Unlocking GVY');

    var graivyTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyToken.deployed().then(function(instance) {
        graivyTokenInstance = instance;

        return graivyTokenInstance.unlock({from: account});
      }).then(function(result) {
        alert('Unlock Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  checkLock: function(adopters, account) {
    event.preventDefault();

    console.log('Checking for locked GVY...');

    var graivyTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyToken.deployed().then(function(instance) {
        graivyTokenInstance = instance;

        return graivyTokenInstance.checkLocked({from: account});
      }).then(function(result) {
        console.log(result);
        balance = result.c[0];

        $('#GVYLocked').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  releaseTime: function(adopters, account) {
    event.preventDefault();

    console.log('Checking for locked GVY release time...');

    var graivyTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyToken.deployed().then(function(instance) {
        graivyTokenInstance = instance;

        return graivyTokenInstance.getReleaseTime({from: account});
      }).then(function(result) {
        console.log(result);
        balance = result.c[0];

        $('#GVYReleased').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getTimestamp: function(adopters) {
    event.preventDefault();

    var current = web3.eth.defaultBlock;
    web3.eth.getBlock(current, function(error, result){
    if(!error)
        $('#CurrentTimestamp').text(result.timestamp);
    else
        console.error(error);
    })
  },

  getBalances: function(adopters, account) {
    console.log('Getting balances...');

    var graivyTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GraivyToken.deployed().then(function(instance) {
        graivyTokenInstance = instance;

        return graivyTokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];

        $('#GVYBalance').text(balance);
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
