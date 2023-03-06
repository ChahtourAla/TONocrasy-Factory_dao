import { toNano } from 'ton-core';
import { Daos } from '../wrappers/Daos';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const daos = provider.open(Daos.createFromConfig({}, await compile('Daos')));

    await daos.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(daos.address);

    // run methods on `daos`
}
