import { Pipewire, PipewireNode, spa_prop, spa_type } from "../src/index.js";

const pipewire = new Pipewire();

pipewire.on("objectAdded", (obj) => {
    if (!(obj instanceof PipewireNode)) return;
    if (obj.id === 66) {
        console.log(`Setting mute param for node id ${obj.id} name ${obj.nodeName}`);
        setImmediate(() => {
            obj.setParam(PipewireNode.spa_param_type.SPA_PARAM_Props, {
                type: spa_type.SPA_TYPE_Object,
                objectType: 0,
                contents: { [spa_prop.SPA_PROP_mute]: { type: spa_type.SPA_TYPE_Bool, value: false } }
            });
            setTimeout(() => pipewire.stopLoop(), 100);
        });
    }
});

pipewire.startLoop();
