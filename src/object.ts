import EventEmitter from "node:events";

export default class PipewireObject extends EventEmitter {
    id: number;
    permissions: number;
    type: string;
    version: number;
    props: { [key: string]: string };

    objectSerial: number;

    constructor(id: number, permissions: number, type: string, version: number, props: { [key: string]: string }) {
        super();

        this.id = id;
        this.permissions = permissions;
        this.type = type;
        this.version = version;
        this.props = props;

        this.objectSerial = Number(props["object.serial"]);
    }
}
