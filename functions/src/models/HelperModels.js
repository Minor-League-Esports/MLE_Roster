"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializable = void 0;
class Serializable {
    get json() { return JSON.stringify(this); }
    /* This wacky wavy typing is to allow us to return the child class type */
    static fromJSON(json) {
        const output = new this();
        let jsonObj;
        if (typeof (json) === "string") {
            jsonObj = JSON.parse(json);
        }
        else {
            jsonObj = json;
        }
        for (const propName in jsonObj) {
            // @ts-ignore
            output[propName] = jsonObj[propName];
        }
        return (output);
    }
}
exports.Serializable = Serializable;
//# sourceMappingURL=HelperModels.js.map