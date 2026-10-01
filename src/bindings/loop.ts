import koffi from "koffi";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const spa_system = koffi.opaque("spa_system");
export const spa_loop = koffi.opaque("spa_loop");
export const spa_loop_control = koffi.opaque("spa_loop_control");

export const spa_loop_utils = koffi.opaque("spa_loop_utils"); // TODO

export const pw_loop = koffi.struct("pw_loop", {
    system: koffi.pointer(spa_system),
    loop: koffi.pointer(spa_loop),
    control: koffi.pointer(spa_loop_control),
    utils: koffi.pointer(spa_loop_utils),
    name: "const char*"
});

export const pw_loop_enter = pipewire.func("pw_loop_enter", "void", [koffi.pointer(pw_loop)]);
export const pw_loop_iterate = pipewire.func("pw_loop_iterate", "int", [koffi.pointer(pw_loop), "int"]);
export const pw_loop_leave = pipewire.func("pw_loop_leave", "void", [koffi.pointer(pw_loop)]);
