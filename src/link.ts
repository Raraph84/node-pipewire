import type Pipewire from "./pipewire.js";
import PipewireObject from "./object.js";

export default class PipewireLink extends PipewireObject {
    factoryId: number;

    outputPort: number;
    inputPort: number;
    outputNode: number;
    inputNode: number;

    constructor(
        pipewire: Pipewire,
        id: number,
        permissions: number,
        type: string,
        version: number,
        props: { [key: string]: string }
    ) {
        super(pipewire, id, permissions, type, version, props);
        this.factoryId = Number(props["factory.id"]);
        this.outputPort = Number(props["link.output.port"]);
        this.inputPort = Number(props["link.input.port"]);
        this.outputNode = Number(props["link.output.node"]);
        this.inputNode = Number(props["link.input.node"]);
        console.log(this.factoryId, this.outputPort, this.inputPort, this.outputNode, this.inputNode);
    }
}
