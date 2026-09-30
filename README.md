# node-pipewire

Node.js bindings for [PipeWire](https://pipewire.org/) using [koffi](https://koffi.dev/) FFI.

## Requirements

- Node.js
- PipeWire (`libpipewire-0.3.so.0`)

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

## Usage

```ts
import * as pw from "pipewire";

pw.pipewire.pw_init(0, null);

const loop = pw.main_loop.pw_main_loop_new(null);
const context = pw.context.pw_context_new(pw.main_loop.pw_main_loop_get_loop(loop), null, 0);
const core = pw.core.pw_context_connect(context, null, 0);
const registry = pw.core.pw_core_get_registry(core, 3, 0);

// ...add listeners, then run the main loop
await new Promise((resolve) => pw.main_loop.pw_main_loop_run.async(loop, resolve));
```

See [`examples/event-registry.ts`](examples/event-registry.ts) for a complete example:

```bash
npx tsx examples/event-registry.ts
```

## License

ISC
