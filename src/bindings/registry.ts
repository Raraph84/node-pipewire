import koffi from "koffi";
import { pw_registry, pw_registry_events } from "./core.js";
import { spa_hook } from "./hook.js";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const PW_VERSION_REGISTRY_EVENTS = 0;

export const pw_registry_add_listener = pipewire.func("pw_registry_add_listener", "int", [
    koffi.pointer(pw_registry), // registry
    koffi.pointer(spa_hook), // listener
    koffi.pointer(pw_registry_events), // events
    "void*" // data
]);

export const pw_registry_bind = pipewire.func("pw_registry_bind", koffi.pointer("void"), [
    koffi.pointer(pw_registry), // registry
    "uint32_t", // id
    "const char*", // type
    "uint32_t", // version
    "size_t" // user_data_size
]);

export const pw_registry_destroy = pipewire.func("pw_registry_destroy", "int", [
    koffi.pointer(pw_registry), // registry
    "uint32_t" // id
]);
