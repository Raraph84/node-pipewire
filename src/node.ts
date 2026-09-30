import koffi from "koffi";
import { spa_hook } from "./hook.js";
import { spa_pod } from "./pod.js";
import { spa_dict } from "./dict.js";
import { spa_param_info } from "./param.js";

const pipewire = koffi.load("libpipewire-0.3.so.0");

export const pw_node = koffi.opaque("pw_node");

export const pw_node_state = koffi.enumeration("pw_node_state", {
    PW_NODE_STATE_ERROR: -1,
    PW_NODE_STATE_CREATING: 0,
    PW_NODE_STATE_SUSPENDED: 1,
    PW_NODE_STATE_IDLE: 2,
    PW_NODE_STATE_RUNNING: 3
});

export const pw_node_info = koffi.struct("pw_node_info", {
    id: "uint32_t",
    max_input_ports: "uint32_t",
    max_output_ports: "uint32_t",
    change_mask: "uint64_t",
    n_input_ports: "uint32_t",
    n_output_ports: "uint32_t",
    state: pw_node_state,
    error: "const char*",
    props: koffi.pointer(spa_dict),
    params: koffi.pointer(spa_param_info),
    n_params: "uint32_t"
});

export const pw_node_events_info = koffi.proto("void", [
    "void*", // data
    koffi.pointer(pw_node_info) // info
]);

export const pw_node_events_param = koffi.proto("void", [
    "void*", // data
    "int", // seq
    "uint32_t", // id
    "uint32_t", // index
    "uint32_t", // next
    koffi.pointer(spa_pod) // param
]);

export const pw_node_events = koffi.struct("pw_node_events", {
    version: "uint32_t",
    info: koffi.pointer(pw_node_events_info),
    param: koffi.pointer(pw_node_events_param)
});

export const pw_node_add_listener = pipewire.func("pw_node_add_listener", "int", [
    koffi.pointer(pw_node), // object
    koffi.pointer(spa_hook), // listener
    koffi.pointer(pw_node_events), // events
    "void*" // data
]);
