import koffi from "koffi";
import type Pipewire from "./pipewire.js";
import type { pw_node_state } from "./bindings/node.js";
import type { spa_param_type } from "./bindings/param.js";
import PipewireObject from "./object.js";
import pw from "./bindings/index.js";

export default class PipewireNode extends PipewireObject {
    static readonly pw_node_state = pw.node.pw_node_state_enum;
    static readonly spa_param_type = pw.param.spa_param_type;

    nodeName: string;
    factoryId: number;

    nodeProxy: unknown | null = null;
    nodeListener: Buffer | null = null;
    nodeEvents: Buffer | null = null;
    nodeEventInfoRegister: bigint | null = null;
    nodeEventParamRegister: bigint | null = null;

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

    attachListener(): void {
        if (this.removed) return;
        if (this.nodeProxy) throw new Error(`Listener already attached to node ${this.id}`);

        this.nodeProxy = pw.registry.pw_registry_bind(
            this.pipewire.registry,
            this.id,
            this.type,
            pw.node.PW_VERSION_NODE,
            0
        );
        this.nodeListener = Buffer.alloc(koffi.sizeof(pw.hook.spa_hook));
        this.nodeEvents = Buffer.alloc(koffi.sizeof(pw.node.pw_node_events));
        this.nodeEventInfoRegister = koffi.register(
            this.nodeEventInfo.bind(this),
            koffi.pointer(pw.node.pw_node_events_info)
        );
        this.nodeEventParamRegister = koffi.register(
            this.nodeEventParam.bind(this),
            koffi.pointer(pw.node.pw_node_events_param)
        );
        koffi.encode(this.nodeEvents, pw.node.pw_node_events, {
            version: pw.node.PW_VERSION_NODE_EVENTS,
            info: this.nodeEventInfoRegister,
            param: this.nodeEventParamRegister
        });
        pw.node.pw_node_add_listener(this.nodeProxy, this.nodeListener, this.nodeEvents, null);
    }

    detachListener(): void {
        if (!this.nodeProxy) throw new Error(`Listener not attached to node ${this.id}`);

        if (!this.removed) pw.proxy.pw_proxy_destroy(this.nodeProxy);
        koffi.unregister(this.nodeEventParamRegister!);
        koffi.unregister(this.nodeEventInfoRegister!);
        this.nodeEventInfoRegister = null;
        this.nodeEventParamRegister = null;
        this.nodeEvents = null;
        this.nodeListener = null;
        this.nodeProxy = null;
    }

    subscribeParams(params: spa_param_type[]) {
        if (this.removed) return;
        if (!this.nodeProxy) throw new Error(`Listener not attached to node ${this.id}`);
        pw.node.pw_node_subscribe_params(this.nodeProxy, params, params.length);
    }

    nodeEventInfo(_data: unknown, info: unknown): void {
        this.emit("rawNodeInfo", info);

        const nodeInfo = koffi.decode(info, pw.node.pw_node_info);

        const changesMasks = Object.keys(pw.node.PW_NODE_CHANGE_MASK) as (keyof typeof pw.node.PW_NODE_CHANGE_MASK)[];
        const changes = changesMasks.filter((key) => nodeInfo.change_mask & pw.node.PW_NODE_CHANGE_MASK[key]);

        const props = koffi.decode(nodeInfo.props, pw.dict.spa_dict);
        if (changes.includes("PROPS") !== !!props.items) throw new Error(`Node ${this.id} props change mismatch`);

        const propsObj: { [key: string]: string } | null = changes.includes("PROPS") ? {} : null;
        if (propsObj) {
            const propsArray = koffi.decode(props.items, pw.dict.spa_dict_item, props.n_items);
            for (const item of propsArray) propsObj[item.key] = item.value;
        }

        const paramsObj: spa_param_type[] = [];
        if (nodeInfo.params) {
            const params = koffi.decode(nodeInfo.params, pw.param.spa_param_info, nodeInfo.n_params);
            for (const param of params) paramsObj.push(param.id as spa_param_type);
        }

        const nodeInfoObj: NodeInfo = {
            id: nodeInfo.id,
            maxInputPorts: nodeInfo.max_input_ports,
            maxOutputPorts: nodeInfo.max_output_ports,
            changes: changes,
            inputPortsCount: nodeInfo.n_input_ports,
            outputPortsCount: nodeInfo.n_output_ports,
            state: nodeInfo.state as pw_node_state,
            error: nodeInfo.error ? koffi.decode(nodeInfo.error, "string") : null,
            props: propsObj,
            params: paramsObj
        };

        this.emit("nodeInfo", nodeInfoObj);
    }

    nodeEventParam(_data: unknown, info: unknown): void {
        this.emit("rawNodeParam", info);
    }
}

type NodeInfo = {
    id: number;
    maxInputPorts: number;
    maxOutputPorts: number;
    changes: (keyof typeof pw.node.PW_NODE_CHANGE_MASK)[];
    inputPortsCount: number;
    outputPortsCount: number;
    state: pw_node_state;
    error: string | null;
    props: { [key: string]: string } | null;
    params: spa_param_type[];
};
