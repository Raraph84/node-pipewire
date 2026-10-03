import koffi from "koffi";

export const spa_pod = koffi.struct("spa_pod", {
    size: "uint32_t",
    type: "uint32_t"
});

export const spa_pod_object_body = koffi.struct("spa_pod_object_body", {
    type: "uint32_t",
    id: "uint32_t"
});

export const spa_pod_prop = koffi.struct("spa_pod_prop", {
    key: "uint32_t",
    flags: "uint32_t",
    value: spa_pod
});
