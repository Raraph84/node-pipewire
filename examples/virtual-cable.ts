import { Pipewire, PipewireNode, PipewirePort } from "../src/index.js";

let linked = false;

const pipewire = new Pipewire();
pipewire.on("objectAdded", (obj) => {
    if (linked || !(obj instanceof PipewirePort)) return;

    const nodes = Object.values(pipewire.objects).filter((o) => o instanceof PipewireNode);
    const sinkNode = nodes.find((n) => n.nodeName === "nodejs_virtual_sink");
    const sourceNode = nodes.find((n) => n.nodeName === "nodejs_virtual_source");
    if (!sinkNode || !sourceNode) return;

    const ports = Object.values(pipewire.objects).filter((o) => o instanceof PipewirePort);
    const leftSinkPort = ports.find(
        (p) => p.nodeId === sinkNode.id && p.portDirection === "in" && p.props["audio.channel"] === "FL"
    );
    const rightSinkPort = ports.find(
        (p) => p.nodeId === sinkNode.id && p.portDirection === "in" && p.props["audio.channel"] === "FR"
    );
    const leftSourcePort = ports.find(
        (p) => p.nodeId === sourceNode.id && p.portDirection === "out" && p.props["audio.channel"] === "FL"
    );
    const rightSourcePort = ports.find(
        (p) => p.nodeId === sourceNode.id && p.portDirection === "out" && p.props["audio.channel"] === "FR"
    );
    if (!leftSinkPort || !rightSinkPort || !leftSourcePort || !rightSourcePort) return;

    linked = true;
    pipewire.createLink(leftSinkPort.id, leftSourcePort.id);
    pipewire.createLink(rightSinkPort.id, rightSourcePort.id);
    console.log("Linked virtual source to virtual sink");
});

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

console.log("Starting PipeWire main loop...");
pipewire.startLoop();

process.on("SIGINT", () => {
    pipewire.stopLoop();
    pipewire.deinit();
    console.log("PipeWire main loop exited, cleanup done.");
});
