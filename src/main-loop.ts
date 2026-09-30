import koffi from "koffi";
import { spa_dict } from "./dict.js";
import { pw_loop } from "./loop.js";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const pw_main_loop = koffi.opaque("pw_main_loop");

export const pw_main_loop_new = pipewire.func("pw_main_loop_new", koffi.pointer(pw_main_loop), [
    koffi.pointer(spa_dict)
]);
export const pw_main_loop_get_loop = pipewire.func("pw_main_loop_get_loop", koffi.pointer(pw_loop), [
    koffi.pointer(pw_main_loop)
]);
export const pw_main_loop_run = pipewire.func("pw_main_loop_run", "int", [koffi.pointer(pw_main_loop)]);
export const pw_main_loop_quit = pipewire.func("pw_main_loop_quit", "int", [koffi.pointer(pw_main_loop)]);
export const pw_main_loop_destroy = pipewire.func("pw_main_loop_destroy", "void", [koffi.pointer(pw_main_loop)]);
