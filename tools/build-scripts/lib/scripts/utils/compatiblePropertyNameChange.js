"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Compatible config filed breaking change
function compatiblePropertyNameChange(obj, propertiesChanged) {
    return new Proxy(obj, {
        get(obj, propName) {
            for (let i = 0; i < propertiesChanged.length; i++) {
                const { prev, now } = propertiesChanged[i];
                if (propName === prev) {
                    return obj[now];
                }
            }
            return obj[propName];
        },
        set(obj, propName, value) {
            for (let i = 0; i < propertiesChanged.length; i++) {
                const { prev, now } = propertiesChanged[i];
                if (propName === prev) {
                    obj[now] = value;
                    return true;
                }
            }
            obj[propName] = value;
            return true;
        },
    });
}
exports.default = compatiblePropertyNameChange;
