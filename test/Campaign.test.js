const assert = require('assert'),
    ganache = require('ganache-cli');

const Web3 = require('web3'),
    web3 = new Web3(ganache.provider());


const compiledFactory = require('../ethereum/build/CampaignFactory'),
    compiledCampaign = require('../ethereum/build/Campaign');


let accounts,
    factory,
    campaign,
    campaignAddress;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await  new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000',
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );

});

describe('Campaigns', () => {
    it('Deploys a factory and a Campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('Marks caller as the Campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager)

    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await  campaign.methods.contribute().send({
            from: accounts[0],
            value: '200'
        });
        const isContributor = campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('test if sending less than minimum contribution fails', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '80'
            });
            assert(false);
        } catch (e) {
            assert(e);
        }
    });

    it('allows manager to create requests', async () => {
        await campaign.methods.createRequest(
            'To buy table and chairs',
            '200',
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        const request = await campaign.methods.requests(0).call();
        assert.equal('To buy table and chairs', request.description);

    });

    it('tests contract from start to end', async () => {
        await campaign.methods.contribute().send({
            from: accounts [0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('Test A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let beforeBalance = await web3.eth.getBalance(accounts[1]);

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let afterBalance = await web3.eth.getBalance(accounts[1]);

        console.log(beforeBalance + "  " + afterBalance)

    });


});


