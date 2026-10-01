import PipewireObject from "./object.js";

export default class PipewireNode extends PipewireObject {
    nodeName: string;
    factoryId: number;

    constructor(id: number, permissions: number, type: string, version: number, props: { [key: string]: string }) {
        super(id, permissions, type, version, props);
        this.nodeName = props["node.name"]!;
        this.factoryId = Number(props["factory.id"]);
    }
}
