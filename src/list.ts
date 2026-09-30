import koffi from "koffi";

const spa_list_opaque = koffi.opaque("spa_list");

export const spa_list = koffi.struct(spa_list_opaque, {
    next: koffi.pointer(spa_list_opaque),
    prev: koffi.pointer(spa_list_opaque)
});
