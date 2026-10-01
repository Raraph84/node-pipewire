import koffi from "koffi";

export const spa_pod = koffi.struct("spa_pod", {
    size: "uint32_t",
    type: "uint32_t"
});
