import { Pipewire } from "../src/index.js";

const pipewire = new Pipewire();

pipewire.on("objectAdded", (obj) => {
    console.log(`New object: id: ${obj.id} type: ${obj.type} version: ${obj.version}`);
});

pipewire.on("objectRemoved", (obj) => {
    console.log(`Removed object: id: ${obj.id}`);
});

console.log("Starting PipeWire main loop...");
pipewire.startLoop();

process.on("SIGINT", () => {
    pipewire.stopLoop();
    pipewire.deinit();
    console.log("PipeWire main loop exited, cleanup done.");
});
