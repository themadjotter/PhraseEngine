import { PhraseNode, InitPacketInterface, EvalPacketInterface } from '../Node';
import { RefableNode } from '../RefableNode';
import mapFilter from '../mapFilter';
import factories from '../factories';
import text from '../text';

import textSupport from '../textSupport';

export class ThenNode extends RefableNode {
    protected validateNodeName(name: string): boolean {
        return name === 'then' || name === 'if' || name === 'unless';
    }

    public init(root: Node, packet: InitPacketInterface): void {
        this.setNextNode(text.call(this, root, packet, textSupport));
        this.registararGenerate(root);
    }

    public eval(packet: EvalPacketInterface, branch?: number): EvalPacketInterface {
        this.registerRender(packet);
        
        return this.next().eval(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        this.registerRender(packet);
        yield* this.next().gen(packet);
        this.deregisterRender(packet);
    }

    public count(e_packet: EvalPacketInterface): number {
        this.registerRender(e_packet);
        const ret = this.next().count(e_packet);
        this.registerRender(e_packet);

        return ret;
    }
}