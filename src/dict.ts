import koffi from "koffi";
import { spa_dict, spa_dict_item } from "./bindings/dict.js";

export const encodeDict = (dict: { [key: string]: string }): Buffer => {
    const spaDict = Buffer.alloc(koffi.sizeof(spa_dict) + koffi.sizeof(spa_dict_item) * Object.keys(dict).length);
    koffi.encode(spaDict, spa_dict, {
        flags: 0,
        n_items: Object.keys(dict).length,
        items: Object.entries(dict).map(([key, value]) => ({ key, value }))
    });
    return spaDict;
};
