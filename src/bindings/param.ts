import koffi from "koffi";

export const spa_param_info = koffi.struct("spa_param_info", {
    id: "uint32_t",
    flags: "uint32_t",
    user: "uint32_t",
    seq: "int32_t",
    padding: koffi.array("uint32_t", 4)
});

export const spa_param_type = {
    SPA_PARAM_Invalid: 0,
    SPA_PARAM_PropInfo: 1,
    SPA_PARAM_Props: 2,
    SPA_PARAM_EnumFormat: 3,
    SPA_PARAM_Format: 4,
    SPA_PARAM_Buffers: 5,
    SPA_PARAM_Meta: 6,
    SPA_PARAM_IO: 7,
    SPA_PARAM_EnumProfile: 8,
    SPA_PARAM_Profile: 9,
    SPA_PARAM_EnumPortConfig: 10,
    SPA_PARAM_PortConfig: 11,
    SPA_PARAM_EnumRoute: 12,
    SPA_PARAM_Route: 13,
    SPA_PARAM_Control: 14,
    SPA_PARAM_Latency: 15,
    SPA_PARAM_ProcessLatency: 16,
    SPA_PARAM_Tag: 17,
    SPA_PARAM_PeerEnumFormat: 18,
    SPA_PARAM_Capability: 19,
    SPA_PARAM_PeerCapability: 20
};
