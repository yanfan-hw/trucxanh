import { Node } from "../core/Node.js";
import { Sprite } from "../core/Sprite.js";
import { Label } from "../core/Label.js";
const BASE_URL =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white";
const ballPokemon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/512px-Pok%C3%A9_Ball_icon.png';
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
        // this.sprite.elm.style.display = "none";
        this.sprite.elm.style.background = "rgb(38, 160, 218)";
        this.sprite.width = 100;
        this.sprite.height = 100;
        this.addChild(this.sprite);
    }
    _createCover() {
        let cover = new Node();
        cover.width = 100;
        cover.height = 100;
        cover.elm.style.background = "rgb(38, 160, 218)";
        cover.elm.style.opacity = 0;
        cover.elm.style.cursor = "pointer";
        this.cover = cover;
        this.addChild(this.cover);
    }
    _createLabel() {
        let label = new Label();
        const LABEL_STYLE = {
            width: '100%',
            height: '100%',
            backgroundImage: `url(${ballPokemon})`,
            backgroundSize: '48px 48px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            cursor: "pointer"
        };
        label.style = LABEL_STYLE;
        this.label = label;
        this.cover.addChild(this.label);
    }
    setValue(value) {
        this.value = value;
        this.sprite.path = `${BASE_URL}/${value + 1}.png`
    }
    open() {
        const tl = gsap.timeline();
        tl.to(this.elm, { scaleX: 0, duration: 0.3 });
        tl.call(() => {
            this.cover.opacity = 0;
        })
        tl.to(this.elm, { scaleX: 1, duration: 0.3 });
    }
    close() {
        const tl = gsap.timeline();
        tl.delay(0.5);
        tl.to(this.elm, 0.1, { x: "-=20", yoyo: true, repeat: 2 })
        tl.to(this.elm, 0.1, { x: "+=20", yoyo: true, repeat: 2 })
        tl.to(this.elm, { scaleX: 0, duration: 0.3 });
        tl.call(() => {
            this.cover.opacity = 1;
        });
        tl.to(this.elm, { scaleX: 1, duration: 0.3 });
    }
    hide() {
        const tl = gsap.timeline();
        tl.to(this.elm, { scale: 1.5, duration: 0.3, delay: 0.5});
        tl.to(this.elm, { scale: 0, duration: 0.3});
    }
}