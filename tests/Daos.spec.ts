import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Daos } from '../wrappers/Daos';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Daos', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Daos');
    });

    let blockchain: Blockchain;
    let daos: SandboxContract<Daos>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        daos = blockchain.openContract(Daos.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await daos.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: daos.address,
            deploy: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and daos are ready to use
    });
});
