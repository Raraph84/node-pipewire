# node-pipewire

Node.js bindings for [PipeWire](https://pipewire.org/) using [koffi](https://koffi.dev/) FFI.

Two layers are exported: high-level classes (`Pipewire`, `PipewireObject`, `PipewireNode`) and raw
bindings (`bindings`) for direct FFI access.

## Requirements

- Node.js
- PipeWire (`libpipewire-0.3.so.0`)

## Install / Build

```bash
npm install
npm run build
```

## Usage

```ts
import { Pipewire, PipewireNode } from "pipewire";

const pipewire = new Pipewire();

pipewire.on("objectAdded", (obj) => {
    console.log(`New object: ${obj.id} (${obj.type})`);
    if (!(obj instanceof PipewireNode)) return;

    obj.on("nodeInfo", (info) => console.log(info.changes));
    obj.attachListener();
});

pipewire.startLoop();

process.on("SIGINT", () => {
    pipewire.stopLoop();
    pipewire.deinit();
});
```

Run with `npx tsx examples/basic.ts` or `npx tsx examples/node-events.ts`.

### Raw bindings

`bindings` exposes the koffi declarations per module (`bindings.pipewire`, `bindings.loop`, `bindings.node`, etc)
if you need to call PipeWire yourself, see `examples/event-registry-sync.ts`.

## License

ISC
