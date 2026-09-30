import koffi from "koffi";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const pw_proxy = koffi.opaque("pw_proxy");

export const pw_proxy_destroy = pipewire.func("pw_proxy_destroy", "void", [koffi.pointer(pw_proxy)]);
