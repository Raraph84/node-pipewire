import EventEmitter from "node:events";
import koffi from "koffi";
import pw from "./bindings/index.js";
import PipewireObject from "./object.js";
import PipewireNode from "./node.js";

export default class Pipewire extends EventEmitter {
    mainLoop: unknown;
    loop: unknown;
    context: unknown;
    core: unknown;
    registry: unknown;

    registryListener: Buffer;
    registryEvents: Buffer;
    registryEventGlobalRegister: bigint;
    registryEventGlobalRemoveRegister: bigint;

    loopInterval: NodeJS.Timeout | null = null;

    objects: { [id: number]: PipewireObject } = {};

    constructor() {
        super();

        pw.pipewire.pw_init(0, null);

        this.mainLoop = pw.main_loop.pw_main_loop_new(null);
        this.loop = pw.main_loop.pw_main_loop_get_loop(this.mainLoop);
        this.context = pw.context.pw_context_new(this.loop, null, 0);
        this.core = pw.core.pw_context_connect(this.context, null, 0);
        this.registry = pw.core.pw_core_get_registry(this.core, pw.core.PW_VERSION_REGISTRY, 0);

        this.registryListener = Buffer.alloc(koffi.sizeof(pw.hook.spa_hook));
        this.registryEvents = Buffer.alloc(koffi.sizeof(pw.core.pw_registry_events));
        this.registryEventGlobalRegister = koffi.register(
            this.registryEventGlobal.bind(this),
            koffi.pointer(pw.core.pw_registry_events_global)
        );
        this.registryEventGlobalRemoveRegister = koffi.register(
            this.registryEventGlobalRemove.bind(this),
            koffi.pointer(pw.core.pw_registry_events_global_remove)
        );
        koffi.encode(this.registryEvents, pw.core.pw_registry_events, {
            version: pw.registry.PW_VERSION_REGISTRY_EVENTS,
            global: this.registryEventGlobalRegister,
            global_remove: this.registryEventGlobalRemoveRegister
        });
        pw.registry.pw_registry_add_listener(this.registry, this.registryListener, this.registryEvents, null);
    }

    registryEventGlobal(
        _data: unknown,
        id: number,
        permissions: number,
        type: string,
        version: number,
        props: unknown
    ): void {
        this.emit("rawObjectAdded", { id, permissions, type, version, props });

        if (this.objects[id]) throw new Error(`Object with id ${id} already exists`);

        const propsDict = koffi.decode(props, pw.dict.spa_dict);
        const propsArray = koffi.decode(propsDict.items, pw.dict.spa_dict_item, propsDict.n_items);

        const propsObj: { [key: string]: string } = {};
        for (const item of propsArray) propsObj[item.key] = item.value;

        if (type === "PipeWire:Interface:Node")
            this.objects[id] = new PipewireNode(this, id, permissions, type, version, propsObj);
        else this.objects[id] = new PipewireObject(this, id, permissions, type, version, propsObj);
        this.emit("objectAdded", this.objects[id]);
    }

    registryEventGlobalRemove(_data: unknown, id: number): void {
        this.emit("rawObjectRemoved", { id });

        if (!this.objects[id]) throw new Error(`Object with id ${id} does not exist`);
        this.objects[id].removed = true;

        if (this.objects[id] instanceof PipewireNode && this.objects[id].nodeProxy) this.objects[id].detachListener();

        this.emit("objectRemoved", this.objects[id]);
        delete this.objects[id];
    }

    startLoop(pollInterval: number = 10, pollTimeout: number = 1): void {
        if (this.loopInterval) throw new Error("Loop already started");
        pw.loop.pw_loop_enter(this.loop);
        this.loopInterval = setInterval(() => pw.loop.pw_loop_iterate(this.loop, pollTimeout), pollInterval);
    }

    stopLoop(): void {
        if (!this.loopInterval) throw new Error("Loop not started");
        clearInterval(this.loopInterval);
        this.loopInterval = null;
        pw.loop.pw_loop_leave(this.loop);
    }

    on(event: "objectAdded", listener: (object: PipewireObject) => void): this;
    on(event: "objectRemoved", listener: (object: PipewireObject) => void): this;
    on(event: "rawObjectAdded", listener: (data: RawObjectAdded) => void): this;
    on(event: "rawObjectRemoved", listener: (data: RawObjectRemoved) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    once(event: "objectAdded", listener: (object: PipewireObject) => void): this;
    once(event: "objectRemoved", listener: (object: PipewireObject) => void): this;
    once(event: "rawObjectAdded", listener: (data: RawObjectAdded) => void): this;
    once(event: "rawObjectRemoved", listener: (data: RawObjectRemoved) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.once(event, listener);
    }

    off(event: "objectAdded", listener: (object: PipewireObject) => void): this;
    off(event: "objectRemoved", listener: (object: PipewireObject) => void): this;
    off(event: "rawObjectAdded", listener: (data: RawObjectAdded) => void): this;
    off(event: "rawObjectRemoved", listener: (data: RawObjectRemoved) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.off(event, listener);
    }

    emit(event: "objectAdded", object: PipewireObject): boolean;
    emit(event: "objectRemoved", object: PipewireObject): boolean;
    emit(event: "rawObjectAdded", data: RawObjectAdded): boolean;
    emit(event: "rawObjectRemoved", data: RawObjectRemoved): boolean;
    emit(event: string | symbol, ...args: any[]): boolean;
    emit(event: string | symbol, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }

    deinit(): void {
        pw.proxy.pw_proxy_destroy(this.registry);
        koffi.unregister(this.registryEventGlobalRegister);
        koffi.unregister(this.registryEventGlobalRemoveRegister);
        pw.core.pw_core_disconnect(this.core);
        pw.context.pw_context_destroy(this.context);
        pw.main_loop.pw_main_loop_destroy(this.mainLoop);
    }
}

export type RawObjectAdded = {
    id: number;
    permissions: number;
    type: string;
    version: number;
    props: unknown;
};

export type RawObjectRemoved = {
    id: number;
};
