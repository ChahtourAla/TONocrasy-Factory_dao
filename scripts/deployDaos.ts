import { toNano, Address, Dictionary, DictionaryValue } from 'ton-core';
import { Daos } from '../wrappers/Daos';
import { compile, NetworkProvider } from '@ton-community/blueprint';

const ListValue: DictionaryValue<string> = {
    serialize(src: string, builder) {
        builder.storeStringRefTail(src);
    },
    parse(src) {
        return src.loadStringRefTail();
    },
};

export async function run(provider: NetworkProvider) {
    const daos = provider.open(
        Daos.createFromConfig(
            {
                daos_list: Dictionary.empty(Dictionary.Keys.Uint(256), ListValue).set(
                    0,
                    'EQBr0J1v2e5-Wnv1Heerjsv4WlOccTpHBhjklHkNvF-F2nxB'
                ),
            },
            await compile('Daos')
        )
    );

    await daos.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(daos.address);

    console.log('✅ factory dao is deployed at address: ', daos.address);

    // run methods on `daos`
}
