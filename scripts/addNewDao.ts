import { Address } from 'ton-core';
import { NetworkProvider, sleep } from '@ton-community/blueprint';
import { Daos } from '../wrappers/Daos';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Contract address'));
    const optAddress = args.length > 0 ? args[0] : await ui.input('Dao address to add');

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const contract = provider.open(Daos.createFromAddress(address));

    const daosBefore = await contract.getDaosList();
    const position = daosBefore.asSlice.length + 1;
    await contract.sendNewDao(provider.sender(), {
        position: position,
        address: optAddress,
    });

    ui.write('Waiting for dao to be added...');

    let daosAfter = await contract.getDaosList();

    let attempt = 1;
    while (daosAfter.equals(daosBefore)) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        daosAfter = await contract.getDaosList();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Dao added successfully!');
}
