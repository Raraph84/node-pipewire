import koffi from "koffi";
import { spa_dict } from "./dict.js";
import { pw_loop } from "./loop.js";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const pw_thread_loop = koffi.opaque("pw_thread_loop");

export const pw_thread_loop_new = pipewire.func("pw_thread_loop_new", koffi.pointer(pw_thread_loop), [
    "const char*", // name
    koffi.pointer(spa_dict) // props
]);
export const pw_thread_loop_destroy = pipewire.func("pw_thread_loop_destroy", "void", [koffi.pointer(pw_thread_loop)]);

export const pw_thread_loop_get_loop = pipewire.func("pw_thread_loop_get_loop", koffi.pointer(pw_loop), [
    koffi.pointer(pw_thread_loop)
]);

export const pw_thread_loop_lock = pipewire.func("pw_thread_loop_lock", "void", [koffi.pointer(pw_thread_loop)]);
export const pw_thread_loop_unlock = pipewire.func("pw_thread_loop_unlock", "void", [koffi.pointer(pw_thread_loop)]);

export const pw_thread_loop_start = pipewire.func("pw_thread_loop_start", "int", [koffi.pointer(pw_thread_loop)]);
export const pw_thread_loop_stop = pipewire.func("pw_thread_loop_stop", "void", [koffi.pointer(pw_thread_loop)]);
