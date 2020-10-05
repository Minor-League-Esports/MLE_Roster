
export class Serializable {
    constructor (){};

    get json(): string{ return JSON.stringify(this); }

    /* This wacky wavy typing is to allow us to return the child class type */
    static fromJSON<T extends Serializable>(json: string | any): T {
        const output = new this();
        let jsonObj : any;
        if(typeof(json) === "string"){
            jsonObj = JSON.parse(json);
        }  else {
            jsonObj = json;
        }
        for (let propName in jsonObj) {
            // @ts-ignore
            output[propName] = jsonObj[propName]
        }
        return (output) as T;
    }
}
