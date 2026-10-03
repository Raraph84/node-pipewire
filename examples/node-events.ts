import { Pipewire, PipewireNode, spa_prop } from "../src/index.js";

const pipewire = new Pipewire();

pipewire.on("objectAdded", (obj) => {
    if (!(obj instanceof PipewireNode)) return;
    console.log(`Node added: id: ${obj.id} name: ${obj.nodeName}`);

    obj.on("nodeInfo", (info) => {
        console.log(`Node info for id ${obj.id}: ${info.changes.join(", ")}`);
    });
    obj.on("nodeParam", (param) => {
        const name = PipewireNode.spa_param_type[param.type];
        console.log(`Node param for id ${obj.id}: ${name}`);

        if (param.type === PipewireNode.spa_param_type.SPA_PARAM_Props) {
            const mute = param.value.contents![spa_prop.SPA_PROP_mute];
            if (mute) console.log(` Mute: ${mute.value}`);
        }
    });

    setImmediate(() => {
        obj.attachListener();
        obj.subscribeParams(Object.values(PipewireNode.spa_param_type).filter((v) => typeof v === "number"));
    });
});

pipewire.on("objectRemoved", (obj) => {
    if (!(obj instanceof PipewireNode)) return;
    console.log(`Node removed: id: ${obj.id} name: ${obj.nodeName}`);
});

console.log("Starting PipeWire main loop...");
pipewire.startLoop();

process.on("SIGINT", () => {
    pipewire.stopLoop();
    pipewire.deinit();
    console.log("PipeWire main loop exited, cleanup done.");
});
