import EventEmitter from "node:events";

export default class PipewireObject extends EventEmitter {
    id: number;
    permissions: number;
    type: string;
    version: number;

    constructor(id: number, permissions: number, type: string, version: number) {
        super();
        this.id = id;
        this.permissions = permissions;
        this.type = type;
        this.version = version;
    }
}
