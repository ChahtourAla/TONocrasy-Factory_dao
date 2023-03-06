import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type DaosConfig = {};

export function daosConfigToCell(config: DaosConfig): Cell {
    return beginCell().endCell();
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
}
