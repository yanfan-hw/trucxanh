import { Node } from "../core/Node.js";
import { Sprite } from "../core/Sprite.js";
import { Label } from "../core/Label.js";
const BASE_URL =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white";
    const pokeballImg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/512px-Pok%C3%A9_Ball_icon.png'
export class Card extends Node {
    constructor(index) {
        super();
        this.index = index;
        this.value = null;
        this._createSprite();
        this._createCover();
        this._createLabel();
    }
    _createSprite() {
        this.sprite = new Sprite();
        this.sprite.width = 100;
        this.sprite.height = 100;
        this.addChild(this.sprite);
    }
    _createCover() {
        let cover = new Node();
        cover.width = 100;
        cover.height = 100;
        cover.elm.style.backfaceVisibility = "hidden";
        cover.elm.style.cursor = "pointer";
        this.cover = cover;
        this.addChild(this.cover);
    }
    _createLabel() {
        let label = new Label();
        // label.text = this.index;
        const LABEL_STYLE = {
            width: '100%',
            height: '100%',
            backgroundImage: `url(${pokeballImg})`,
            backgroundSize: '48px 48px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backfaceVisibility: 'hidden',
            cursor: "pointer"
        };
        label.style = LABEL_STYLE;
        this.label = label;
        this.addChild(this.label);
    }
    setValue(value) {
        this.value = value;
        this.sprite.path = `${BASE_URL}/${value + 1}.png`
    }
    open() {
        this.elm.style.transform = "rotateY(180deg)";
    }
    close() {
        this.elm.style.transform = "unset";
    }
    hide() {
        this.elm.style.display = "none";
    }
}