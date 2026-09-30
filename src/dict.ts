import koffi from "koffi";

export const spa_dict_item = koffi.struct("spa_dict_item", {
    key: "const char*",
    value: "const char*"
});

export const spa_dict = koffi.struct("spa_dict", {
    flags: "uint32_t",
    n_items: "uint32_t",
    items: koffi.pointer(spa_dict_item)
});
