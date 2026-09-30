import koffi from "koffi";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const pw_init = pipewire.func("pw_init", "void", ["int**", "char***"]);
export const pw_deinit = pipewire.func("pw_deinit", "void", []);
