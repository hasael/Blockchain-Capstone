// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

var SquareVerifier = artifacts.require('SquareVerifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('mint solutions correctly', function () {
        before(async function () {
            this.proof = {
                "a": [
                    "0x28dec83418111fe6d2385e68af7406eb692d9c8b6bb293db8d0c4bfc0bf4001a",
                    "0x01b5d40781c52609ddc7d68081b68d1ef8808ee2e1379657946d458d53d9bf27"
                ],
                "b": [
                    [
                        "0x2aebc1f769b7dcef71010bfeb0dfcf109f861f890f7ddc30b6a6b727927c4b65",
                        "0x193b149792dbc355a3bc2e5b94bef745d874f34e280a65cdf8cdf233867eb3d6"
                    ],
                    [
                        "0x050cf86ca6817960568d05447df62e8f7859448ce694715cdd3161b13c01395f",
                        "0x02b81e5ffa54a1a2ca0130a1c27e6fa33603e380e4471b5518ccf840e3e27209"
                    ]
                ],
                "c": [
                    "0x2f73b1ed4d16d9841ff489c48ffb0e45c9e7c0d9bd704c94b2f95afcde21e30c",
                    "0x1de9bd6966f8dabb69ece41c3b8dcc6d32f9480f0bba21237416f9bcca05667c"
                ]
            };

            this.inputs = [
                "0x0000000000000000000000000000000000000000000000000000000000000010",
                "0x0000000000000000000000000000000000000000000000000000000000000001"
            ];

            this.verifier = await SquareVerifier.new({ from: account_one });
            this.contract = await SolnSquareVerifier.new("El Token", "ELT", this.verifier.address, { from: account_one });
        })

        it('A solution can be added', async function () {

            let result = await this.contract.addSolution(this.proof, this.inputs, { from: account_two });

            let firstEvent = result.logs[0];

            assert.notEqual(firstEvent, null, "No event emitted");
            assert.equal(firstEvent.event, "SolutionAdded", "Incorrect event emitted");
            assert.equal(firstEvent.args.index, 0, "Expected event to be first");
            assert.equal(firstEvent.args.owner, account_two, "Incorrect owner");
        })

        it('Token can be minted', async function () {
            await this.contract.mint(this.proof, this.inputs, 1, { from: account_two });

            let balance = await this.contract.balanceOf(account_two);
            assert.equal(balance, 1, "Incorrect balance token");
        })
    });
});
