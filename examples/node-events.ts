import { Pipewire, PipewireNode } from "../src/index.js";

const pipewire = new Pipewire();

pipewire.on("objectAdded", (obj) => {
    if (!(obj instanceof PipewireNode)) return;
    console.log(`Node added: id: ${obj.id} name: ${obj.nodeName}`);

    obj.on("nodeInfo", (info) => {
        console.log(`Node info for id ${obj.id}: ${info.changes.join(", ")}`);
    });
    obj.on("rawNodeParam", () => {
        console.log(`Node param for id ${obj.id}`);
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
