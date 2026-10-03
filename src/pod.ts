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

export const encodePodValue = (value: PodValue): Buffer => {
    if (value.type === pw.type.spa_type.SPA_TYPE_Bool) {
        const buf = Buffer.alloc(koffi.sizeof("int32_t"));
        koffi.encode(buf, "int32_t", value.value ? 1 : 0);
        return buf;
    } else if (value.type === pw.type.spa_type.SPA_TYPE_Int) {
        const buf = Buffer.alloc(koffi.sizeof("int32_t"));
        koffi.encode(buf, "int32_t", value.value);
        return buf;
    } else if (value.type === pw.type.spa_type.SPA_TYPE_Long) {
        const buf = Buffer.alloc(koffi.sizeof("int64_t"));
        koffi.encode(buf, "int64_t", value.value);
        return buf;
    } else if (value.type === pw.type.spa_type.SPA_TYPE_Float) {
        const buf = Buffer.alloc(koffi.sizeof("float"));
        koffi.encode(buf, "float", value.value);
        return buf;
    } else if (value.type === pw.type.spa_type.SPA_TYPE_Double) {
        const buf = Buffer.alloc(koffi.sizeof("double"));
        koffi.encode(buf, "double", value.value);
        return buf;
    } else if (value.type === pw.type.spa_type.SPA_TYPE_String) {
        const buf = Buffer.from(value.value as string);
        return buf;
    } else if (value.type === pw.type.spa_type.SPA_TYPE_Object) {
        const objectBody = Buffer.alloc(koffi.sizeof(pw.pod.spa_pod_object_body));
        koffi.encode(objectBody, pw.pod.spa_pod_object_body, { type: value.objectType, id: 0 });

        const contents = [];
        for (const [propKey, propVal] of Object.entries(value.contents!)) {
            const encodedVal = encodePodValue(propVal);

            const alignedVal = Buffer.alloc(align8(encodedVal.length));
            encodedVal.copy(alignedVal);

            const prop = Buffer.alloc(koffi.sizeof(pw.pod.spa_pod_prop));
            koffi.encode(prop, pw.pod.spa_pod_prop, {
                key: Number(propKey),
                flags: 0,
                value: { size: encodedVal.length, type: propVal.type }
            });
            contents.push(Buffer.concat([prop, alignedVal]));
        }

        return Buffer.concat([objectBody, ...contents]);
    } else throw new Error("Unsupported pod type");
};

export const parsePod = (ptr: unknown): PodValue => {
    const pod = koffi.decode(ptr, pw.pod.spa_pod);
    return parsePodValue(pod.type, ptr, koffi.sizeof(pw.pod.spa_pod), pod.size);
};

export const encodePod = (value: PodValue): unknown => {
    const val = encodePodValue(value);
    const pod = Buffer.alloc(koffi.sizeof(pw.pod.spa_pod));
    koffi.encode(pod, pw.pod.spa_pod, { type: value.type, size: val.length });
    return Buffer.concat([pod, val]);
};

const align8 = (n: number) => (n + 7) & ~7;

export type PodValue = {
    type: spa_type;

    value?: boolean | number | string;

    objectType?: spa_type;
    contents?: { [key: number]: PodValue };
};
