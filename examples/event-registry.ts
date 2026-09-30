import koffi from "koffi";
import * as pw from "../src/index.js";

(async () => {
    pw.pipewire.pw_init(0, null);

    const loop = pw.main_loop.pw_main_loop_new(null);
    const context = pw.context.pw_context_new(pw.main_loop.pw_main_loop_get_loop(loop), null, 0);
    const core = pw.core.pw_context_connect(context, null, 0);
    const registry = pw.core.pw_core_get_registry(core, 3, 0);
    const registry_listener = Buffer.alloc(koffi.sizeof(pw.hook.spa_hook));

    const registry_event_global = (
        data: Buffer,
        id: number,
        permissions: number,
        type: string,
        version: number,
        props: Buffer
    ) => {
        console.log(`object: id:${id} type:${type}/${version}`);
    };

    const registry_events = {
        version: 0,
        global: koffi.register(registry_event_global, koffi.pointer(pw.core.pw_registry_events_globals)),
        global_remove: null
    };

    pw.registry.pw_registry_add_listener(registry, registry_listener, registry_events, null);

    process.on("SIGINT", () => {
        pw.main_loop.pw_main_loop_quit(loop);
    });

    console.log("Starting PipeWire main loop...");
    await new Promise((resolve) => pw.main_loop.pw_main_loop_run.async(loop, resolve));

    pw.proxy.pw_proxy_destroy(registry);
    pw.core.pw_core_disconnect(core);
    pw.context.pw_context_destroy(context);
    pw.main_loop.pw_main_loop_destroy(loop);

    console.log("PipeWire main loop exited, cleanup done.");
})();
