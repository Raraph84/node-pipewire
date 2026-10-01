import type Pipewire from "./pipewire.js";
import PipewireObject from "./object.js";

export default class PipewireNode extends PipewireObject {
    nodeName: string;
    factoryId: number;

    constructor(
        pipewire: Pipewire,
        id: number,
        permissions: number,
        type: string,
        version: number,
        props: { [key: string]: string }
    ) {
        super(pipewire, id, permissions, type, version, props);
        this.nodeName = props["node.name"]!;
        this.factoryId = Number(props["factory.id"]);
    }
}
