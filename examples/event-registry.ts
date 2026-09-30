import koffi from "koffi";
import * as pw from "../src/index.js";

(async () => {
    pw.pipewire.pw_init(0, null);

    const loop = pw.main_loop.pw_main_loop_new(null);
    const context = pw.context.pw_context_new(pw.main_loop.pw_main_loop_get_loop(loop), null, 0);
    const core = pw.core.pw_context_connect(context, null, 0);
    const registry = pw.core.pw_core_get_registry(core, 3, 0);

    const registry_event_global = (
        data: unknown,
        id: number,
        permissions: number,
        type: string,
        version: number,
        props: unknown
    ) => {
        console.log(`New object: id: ${id} type: ${type} version: ${version}`);
    };

    const registry_event_global_remove = (data: unknown, id: number) => {
        console.log(`Removed object: id: ${id}`);
    };

    const registry_listener = Buffer.alloc(koffi.sizeof(pw.hook.spa_hook));
    const registry_events = Buffer.alloc(koffi.sizeof(pw.core.pw_registry_events));
    const registry_event_global_register = koffi.register(
        registry_event_global,
        koffi.pointer(pw.core.pw_registry_events_global)
    );
    const registry_event_global_remove_register = koffi.register(
        registry_event_global_remove,
        koffi.pointer(pw.core.pw_registry_events_global_remove)
    );
    koffi.encode(registry_events, pw.core.pw_registry_events, {
        version: 0,
        global: registry_event_global_register,
        global_remove: registry_event_global_remove_register
    });
    pw.registry.pw_registry_add_listener(registry, registry_listener, registry_events, null);

    console.log("Starting PipeWire main loop...");
    process.on("SIGINT", () => pw.main_loop.pw_main_loop_quit(loop));
    await new Promise((resolve) => pw.main_loop.pw_main_loop_run.async(loop, resolve));

    pw.proxy.pw_proxy_destroy(registry);
    koffi.unregister(registry_event_global_register);
    koffi.unregister(registry_event_global_remove_register);
    pw.core.pw_core_disconnect(core);
    pw.context.pw_context_destroy(context);
    pw.main_loop.pw_main_loop_destroy(loop);

    console.log("PipeWire main loop exited, cleanup done.");
})();
