import koffi from "koffi";

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
