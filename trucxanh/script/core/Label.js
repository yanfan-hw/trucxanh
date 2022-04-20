import { Node } from "./Node.js";

export class Label extends Node {
    constructor() {
        super();
        this._text = "";
        this._style = {};
    }

    get text() {
        return this._text;
    }
    set text(value){
        this._text = value;
        this.elm.innerText = value;
    }
    get style() {
        return this._style
    }
    set style(value) {
        this._style = value
        Object.assign(this.elm.style, value)
    }
}