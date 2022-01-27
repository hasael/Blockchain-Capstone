var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({ from: account_one });

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, web3.utils.toBN(1), { from: account_one });
            await this.contract.mint(account_one, 2, { from: account_one });
            await this.contract.mint(account_two, 3, { from: account_one });
            await this.contract.mint(account_two, 4, { from: account_one });
            await this.contract.mint(account_two, 5, { from: account_one });
        })

        it('should return total supply', async function () {
            let total = await this.contract.totalSupply();
            assert.equal(total.toString(), "5");
        })

        it('should get token balance', async function () {
            let count = await this.contract.balanceOf(account_one);
            assert.equal(count, 2);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let tokenURI = await this.contract.tokenURI(3);
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3");
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(account_two, account_one, 3, { from: account_two });
            let newOwner = await this.contract.ownerOf(3);
            assert.equal(newOwner, account_one);
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({ from: account_one });
        })

        it('should fail when minting when address is not contract owner', async function () {

        })

        it('should return contract owner', async function () {

        })

    });
})