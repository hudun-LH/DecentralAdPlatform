/**
 * Created by rapospectre on 2018/1/28.
 */

App = {
    web3Provider: null,
    contracts: {},

    init: function () {
        return App.initWeb3();
    },

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Adx.json', function (data) {
            var AdxArtifact = data;
            App.contracts.Adx = TruffleContract(AdxArtifact);

            // Set the provider for our contract
            App.contracts.Adx.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
        });
        return App.bindEvents();

    },

    bindEvents: function () {
        $(document).on('click', '.btn-adopt', App.handleAd);
        var adxInstance;

        // 获取 client 用户账号
        // web3.eth.getAccounts(function (error, accounts) {
        //     if (error) {
        //         console.log(error);
        //     }
        //
        //     var account = accounts[0];
        //
        //     // App.contracts.Adx.deployed().then(function (instance) {
        //     //     adxInstance = instance;
        //     //
        //     //     adxInstance.getAd.call().then(function (adId) {
        //     //         $.getJSON('../pets.json', function (data) {
        //     //             var petsRow = $('#petsRow');
        //     //             var petTemplate = $('#petTemplate');
        //     //             var i = adId;
        //     //             petTemplate.find('.panel-title').text(data[i].title);
        //     //             petTemplate.find('img').attr('src', data[i].picture);
        //     //             petTemplate.find('.pet-breed').text(data[i].title);
        //     //             petTemplate.find('.pet-age').text(data[i].bid);
        //     //             petTemplate.find('.pet-location').text(data[i].budget);
        //     //             petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        //     //
        //     //             petsRow.append(petTemplate.html());
        //     //         });
        //     //     });
        //     // }).catch(function (err) {
        //     //     console.log(err.message);
        //     // });
        // });
        $.getJSON('../pets.json', function (data) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');
            var i = 1;
            petTemplate.find('.panel-title').text(data[i].title);
            petTemplate.find('img').attr('src', data[i].picture);
            petTemplate.find('.pet-breed').text(data[i].title);
            petTemplate.find('.pet-age').text(data[i].bid);
            petTemplate.find('.pet-location').text(data[i].budget);
            petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

            petsRow.append(petTemplate.html());
        });
    },

    handleAd: function (event) {
        event.preventDefault();

        var adId = parseInt($(event.target).data('id'));
        var adxInstance;

        // 获取用户账号
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Adx.deployed().then(function (instance) {
                adxInstance = instance;

                // 结算广告
                return adxInstance.chargeingAd(adId);
            }).catch(function (err) {
                console.log(err.message);
            });
        });

    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
