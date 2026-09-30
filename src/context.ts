import koffi from "koffi";
import { pw_loop } from "./loop.js";
import { pw_properties } from "./properties.js";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const pw_context = koffi.opaque("pw_context");

export const pw_context_new = pipewire.func("pw_context_new", koffi.pointer(pw_context), [
    koffi.pointer(pw_loop),
    koffi.pointer(pw_properties),
    "size_t"
]);

export const pw_context_destroy = pipewire.func("pw_context_destroy", "void", [koffi.pointer(pw_context)]);
