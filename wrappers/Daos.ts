import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    crc32c,
    Dictionary,
    DictionaryValue,
    Sender,
    SendMode,
    Slice,
    toNano,
} from 'ton-core';
import { crc32, crc32str } from '../utils/crc32';

export type DaosConfig = {
    daos_list: Dictionary<number, string>;
};

const ListValue: DictionaryValue<string> = {
    serialize(src: string, builder) {
        builder.storeStringRefTail(src);
    },
    parse(src) {
        return src.loadStringRefTail();
    },
};

export function daosConfigToCell(config: DaosConfig): Cell {
    return beginCell().storeDict(config.daos_list).endCell();
}

export function decodeConfig(cell: Cell): DaosConfig {
    let slice = cell.beginParse();
    return {
        daos_list: slice.loadDict(Dictionary.Keys.Uint(256), ListValue),
    };
}

export class Daos implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Daos(address);
    }

    static createFromConfig(config: DaosConfig, code: Cell, workchain = 0) {
        const data = daosConfigToCell(config);
        const init = { code, data };
        return new Daos(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendNewDao(
        provider: ContractProvider,
        via: Sender,
        opts: {
            position: number;
            address: string;
        }
    ) {
        const messageBody = beginCell()
            .storeUint(crc32str('op::add_new_dao'), 32)
            .storeUint(0, 64) // query id
            .storeUint(opts.position, 256)
            .storeStringRefTail(opts.address)
            .endCell();

        await provider.internal(via, {
            value: toNano('0.05'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBody,
        });
    }

    async getDaosList(provider: ContractProvider) {
        return (await provider.get('get_daos_list', [])).stack.readCell();
    }
}
