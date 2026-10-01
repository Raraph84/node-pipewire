import koffi from "koffi";
import { spa_list } from "./list.js";

export const spa_callbacks = koffi.struct("spa_callbacks", {
    funcs: "void*",
    data: "void*"
});

const spa_hook_opaque = koffi.opaque("spa_hook");

export const spa_hook = koffi.struct(spa_hook_opaque, {
    link: spa_list,
    cb: spa_callbacks,
    removed: koffi.pointer(koffi.proto("void", [koffi.pointer(spa_hook_opaque)])),
    priv: "void*"
});
