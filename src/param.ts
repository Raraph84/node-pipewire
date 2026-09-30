import koffi from "koffi";

export const spa_param_info = koffi.struct("spa_param_info", {
    id: "uint32_t",
    flags: "uint32_t",
    user: "uint32_t",
    seq: "int32_t",
    padding: koffi.array("uint32_t", 4)
});
