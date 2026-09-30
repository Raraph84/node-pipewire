import koffi from "koffi";
import { pw_context } from "./context.js";
import { pw_properties } from "./properties.js";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const pw_core = koffi.opaque("pw_core");
export const pw_registry = koffi.opaque("pw_registry");

export const pw_context_connect = pipewire.func("pw_context_connect", koffi.pointer(pw_core), [
    koffi.pointer(pw_context),
    koffi.pointer(pw_properties),
    "size_t"
]);

export const pw_core_get_registry = pipewire.func("pw_core_get_registry", koffi.pointer(pw_registry), [
    koffi.pointer(pw_core),
    "uint32_t",
    "size_t"
]);

export const pw_registry_events_global = koffi.proto("void", [
    "void*", // data
    "uint32_t", // id
    "uint32_t", // permissions
    "const char*", // type
    "uint32_t", // version
    "void*" // props
]);

export const pw_registry_events_global_remove = koffi.proto("void", [
    "void*", // data
    "uint32_t" // id
]);

export const pw_registry_events = koffi.struct("pw_registry_events", {
    vesion: "uint32_t",
    global: koffi.pointer(pw_registry_events_global),
    global_remove: koffi.pointer(pw_registry_events_global_remove)
});

export const pw_core_disconnect = pipewire.func("pw_core_disconnect", "int", [koffi.pointer(pw_core)]);
