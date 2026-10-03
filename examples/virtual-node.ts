import { Pipewire } from "../src/index.js";

const pipewire = new Pipewire();
pipewire.createNode({
    "factory.name": "support.null-audio-sink",
    "node.name": "nodejs_virtual_source",
    "node.description": "NodeJS Virtual Source",
    "media.class": "Audio/Source/Virtual"
});
pipewire.createNode({
    "factory.name": "support.null-audio-sink",
    "node.name": "nodejs_virtual_sink",
    "node.description": "NodeJS Virtual Sink",
    "media.class": "Audio/Sink"
});
pipewire.startLoop();

setTimeout(() => {
    pipewire.stopLoop();
    pipewire.deinit();
}, 10_000);
