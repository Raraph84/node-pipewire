import koffi from "koffi";
import { pw_context } from "./context.js";
import { pw_properties } from "./properties.js";
import { spa_dict } from "./dict.js";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const PW_VERSION_REGISTRY = 3;

export const pw_core = koffi.opaque("pw_core");
export const pw_registry = koffi.opaque("pw_registry");

export const pw_context_connect = pipewire.func("pw_context_connect", koffi.pointer(pw_core), [
    koffi.pointer(pw_context), // context
    koffi.pointer(pw_properties), // properties
    "size_t" // user_data_size
]);

export const pw_core_get_registry = pipewire.func("pw_core_get_registry", koffi.pointer(pw_registry), [
    koffi.pointer(pw_core), // core
    "uint32_t", // version
    "size_t" // user_data_size
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
    version: "uint32_t",
    global: koffi.pointer(pw_registry_events_global),
    global_remove: koffi.pointer(pw_registry_events_global_remove)
});

export const pw_core_disconnect = pipewire.func("pw_core_disconnect", "int", [koffi.pointer(pw_core)]);

export const pw_core_create_object = pipewire.func("pw_core_create_object", "void*", [
    koffi.pointer(pw_core), // core
    "char*", // factory_name
    "char*", // type
    "uint32_t", // version
    koffi.pointer(spa_dict), // properties
    "size_t" // user_data_size
]);
