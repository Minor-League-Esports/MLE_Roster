export class Sheet {
    headers: string[][];
    data: any[][];
    constructor(
        headers: string[][],
        data: any[][]
    ) {
        this.headers = headers;
        this.data = data;
    }
}