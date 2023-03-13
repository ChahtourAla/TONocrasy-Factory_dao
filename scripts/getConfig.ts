import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient, Address } from 'ton';
import { Daos } from '../wrappers/Daos';

export async function run() {
    // initialize ton rpc client on testnet
    const endpoint = await getHttpEndpoint({ network: 'testnet' });
    const client = new TonClient({ endpoint });

    // open Factory dao instance by address
    const factorydaoAddress = Address.parse('EQBYYNiCRZEVOoAnHjhdV1dbvQFIYobb5TmLcshQ80z2ZjsI'); // replace with dao address
    const factorydao = new Daos(factorydaoAddress);
    const factorydaoContract = client.open(factorydao);

    // call the getter on chain
    const config = await factorydaoContract.getDaosList();

    console.log(config);
}
