import koffi from "koffi";
import { pw_registry, pw_registry_events } from "./core.js";
import { spa_hook } from "./hook.js";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const pw_registry_add_listener = pipewire.func("pw_registry_add_listener", "int", [
    koffi.pointer(pw_registry),
    koffi.pointer(spa_hook),
    koffi.pointer(pw_registry_events),
    "void*"
]);
