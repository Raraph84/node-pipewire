import koffi from "koffi";

export const spa_param_info = koffi.struct("spa_param_info", {
    id: "uint32_t",
    flags: "uint32_t",
    user: "uint32_t",
    seq: "int32_t",
    padding: koffi.array("uint32_t", 4)
});

export enum spa_param_type {
    SPA_PARAM_Invalid,
    SPA_PARAM_PropInfo,
    SPA_PARAM_Props,
    SPA_PARAM_EnumFormat,
    SPA_PARAM_Format,
    SPA_PARAM_Buffers,
    SPA_PARAM_Meta,
    SPA_PARAM_IO,
    SPA_PARAM_EnumProfile,
    SPA_PARAM_Profile,
    SPA_PARAM_EnumPortConfig,
    SPA_PARAM_PortConfig,
    SPA_PARAM_EnumRoute,
    SPA_PARAM_Route,
    SPA_PARAM_Control,
    SPA_PARAM_Latency,
    SPA_PARAM_ProcessLatency,
    SPA_PARAM_Tag,
    SPA_PARAM_PeerEnumFormat,
    SPA_PARAM_Capability,
    SPA_PARAM_PeerCapability
}
