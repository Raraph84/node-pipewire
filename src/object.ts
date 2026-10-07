import EventEmitter from "node:events";
import type Pipewire from "./pipewire.js";
import pw from "./bindings/index.js";

export default class PipewireObject extends EventEmitter {
    pipewire: Pipewire;
    removed: boolean = false;

    id: number;
    permissions: number;
    type: string;
    version: number;
    props: { [key: string]: string };

    objectSerial: number;

    constructor(
        pipewire: Pipewire,
        id: number,
        permissions: number,
        type: string,
        version: number,
        props: { [key: string]: string }
    ) {
        super();

        this.pipewire = pipewire;

        this.id = id;
        this.permissions = permissions;
        this.type = type;
        this.version = version;
        this.props = props;

        this.objectSerial = Number(props["object.serial"]);
    }

    destroy(): void {
        pw.registry.pw_registry_destroy(this.pipewire.registry, this.id);
    }
}
