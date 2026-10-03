import koffi from "koffi";
import pw from "./bindings/index.js";
import { spa_type } from "./bindings/type.js";

export const parsePodValue = (type: spa_type, body: unknown, offset: number, size: number): PodValue => {
    if (type === pw.type.spa_type.SPA_TYPE_Bool) return { type, value: !!koffi.decode(body, offset, "int32_t") };
    else if (type === pw.type.spa_type.SPA_TYPE_Id) return { type, value: koffi.decode(body, offset, "uint32_t") };
    else if (type === pw.type.spa_type.SPA_TYPE_Int) return { type, value: koffi.decode(body, offset, "int32_t") };
    else if (type === pw.type.spa_type.SPA_TYPE_Long) return { type, value: koffi.decode(body, offset, "int64_t") };
    else if (type === pw.type.spa_type.SPA_TYPE_Float) return { type, value: koffi.decode(body, offset, "float") };
    else if (type === pw.type.spa_type.SPA_TYPE_Double) return { type, value: koffi.decode(body, offset, "double") };
    else if (type === pw.type.spa_type.SPA_TYPE_String)
        return { type, value: koffi.decode(body, offset, koffi.array("char", size)) };
    else if (type === pw.type.spa_type.SPA_TYPE_Object) {
        const endOffset = offset + size;

        const objectBody = koffi.decode(body, offset, pw.pod.spa_pod_object_body);
        offset += koffi.sizeof(pw.pod.spa_pod_object_body);

        const contents: { [key: number]: PodValue } = {};
        while (offset !== endOffset) {
            const prop = koffi.decode(body, offset, pw.pod.spa_pod_prop);

            contents[prop.key] = parsePodValue(
                prop.value.type,
                body,
                offset + koffi.sizeof(pw.pod.spa_pod_prop),
                prop.value.size
            );

            offset += koffi.sizeof(pw.pod.spa_pod_prop) + align8(prop.value.size);
        }

        return { type, objectType: objectBody.type, contents };
    }
    return { type };
};

export const parsePod = (ptr: unknown): PodValue => {
    const pod = koffi.decode(ptr, pw.pod.spa_pod);
    return parsePodValue(pod.type, ptr, koffi.sizeof(pw.pod.spa_pod), pod.size);
};

const align8 = (n: number) => (n + 7) & ~7;

export type PodValue = {
    type: spa_type;

    value?: boolean | number | string;

    objectType?: spa_type;
    contents?: { [key: number]: PodValue };
};
