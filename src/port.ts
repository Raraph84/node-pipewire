import type Pipewire from "./pipewire.js";
import PipewireObject from "./object.js";

export default class PipewirePort extends PipewireObject {
    objectPath: string;
    portId: number;
    portName: string;
    portDirection: "out" | "in";
    portAlias: string;
    portGroup: string;
    nodeId: number;

    constructor(
        pipewire: Pipewire,
        id: number,
        permissions: number,
        type: string,
        version: number,
        props: { [key: string]: string }
    ) {
        super(pipewire, id, permissions, type, version, props);
        this.objectPath = props["object.path"]!;
        this.portId = Number(props["port.id"]);
        this.portName = props["port.name"]!;
        this.portDirection = props["port.direction"] as "out" | "in";
        this.portAlias = props["port.alias"]!;
        this.portGroup = props["port.group"]!;
        this.nodeId = Number(props["node.id"]);
    }
}
