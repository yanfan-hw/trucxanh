import { Node } from "./core/Node.js";
import { Card } from "./components/Card.js";
import { Label } from "./core/Label.js";

class Game extends Node {
    constructor() {
        super();
        this._createPlayGameBtn();
    }
    _init() {
        this.canClick = true;
        this.firstCard = null;
        this.secondCard = null;
        this.score = 100;
        this.cardFlipped = 0;
        gameSong.play();
        this._createCards();
        this._createScore();
    }
    _createCards() {
        this.cards = [];
        for (let index = 0; index < 20; index++) {
            let card = new Card(index);
            const CARD_STYLE = {
                // transition: 'transform 0.5s ease-in-out 0s',
                // transformStyle: 'preserve-3d',
                backgroundColor: 'rgb(38, 160, 218)',
                borderRadius: '5px',
                border: '2px solid rgb(255, 255, 255)'
            };
            Object.assign(card.elm.style, CARD_STYLE);
            card.width = 100;
            card.height = 100;
            // let row = index % 5;
            // let col = Math.floor(index / 5);
            card.x = (505 - 100) / 2;
            card.y = (400 - 100) / 2;
            card.elm.addEventListener("click", this.onClickCard.bind(this, card));
            this.addChild(card);
            this.cards.push(card);
        }
        // console.log(this.cards);
        // const tl = gsap.timeline();
        // for (let i = 19; i >= 0; i++) {
        //     tl.fromTo(this.cards[i], 0.2, { alpha: 0 }, { ease: Back.easeOut.config(6), alpha: 1});
        //     if (i == 0) {
        //         tl.fromTo(this.cards[i], 1, { alpha: 0 }, {
        //             ease: Back.easeOut.config(6),
        //             alpha: 1,
        //             onComplete: this.move()
        //         });
        //     }
        // }
        // tl.delay = 1;

        // tl.play();
        this.move();
        this.shuffleCards(this.cards)
    }
    move() {
        const tl = gsap.timeline();
        for (let i = 0; i < 20; i++) {
            let row = i % 5;
            let col = Math.floor(i / 5);
            tl.to(this.cards[i], 0.3, {
                ease: Back.easeOut.config(6),
                x: row * 110,
                y: col * 110,
                // delay: i * 0.1
            })
        };
    }
    _createScore() {
        this.scoreText = new Label();
        const SCORE_STYLE = {
            color: 'black',
            fontSize: '30px',
            lineHeight: 2,
            fontWeight: 500,
            width: "100%",
            textAlign: "center",
            borderRadius: "10px",
            backgroundColor: "#fff"
        };
        this.scoreText.style = SCORE_STYLE;
        this.scoreText.y = 440;
        this.scoreText.text = "Score: " + this.score;

        this.addChild(this.scoreText);
    }
    _createPlayGameBtn() {
        this.btnPlayGame = new Label();
        this.btnPlayGame.elm.classList.add('btn-game');
        this.btnPlayGame.x = 90;
        this.btnPlayGame.y = 150;
        this.btnPlayGame.text = "PLAY GAME";
        this.btnPlayGame.elm.addEventListener("click", this.playGame.bind(this, this.btnPlayGame));
        this.addChild(this.btnPlayGame);
    }
    playGame() {
        this.btnPlayGame.elm.style.display = "none";
        this._init();
    }
    _createReplayGameBtn() {
        this.btnReplayGame = new Label();
        this.btnReplayGame.elm.classList.add('btn-game');
        this.btnReplayGame.x = 90;
        this.btnReplayGame.y = 150;
        this.btnReplayGame.text = "REPLAY GAME";
        this.btnReplayGame.elm.addEventListener("click", this.resetGame.bind(this, this.btnReplayGame));
        this.addChild(this.btnReplayGame);
    }
    animationScore(startScore, endScore) {
        if (startScore === endScore) return;
        const range = endScore - startScore;
        let current = startScore;
        const increment = endScore > startScore ? 1 : -1;
        const stepTime = Math.abs(Math.floor(1000 / range));
        let timeAnimateScore = setInterval(() => {
            current += increment
            this.scoreText.text = "Score: " + current;
            if (current === endScore) {
                clearInterval(timeAnimateScore);
            }
        }, stepTime);
    }
    plusScore(bonusScore) {
        this.animationScore(this.score, this.score + bonusScore);
        this.score = this.score + bonusScore;
        if (this.cardFlipped === 10) this.gameWin();
    }
    minusScore(penaltyScore) {
        this.animationScore(this.score, this.score - penaltyScore);
        this.score = this.score - penaltyScore;
        if (this.score === 0) this.gameLose();
    }

    shuffleCards(array) {
        let randomArr = [];
        for (let i = 0; i < 10; i++) {
            randomArr.push(i);
            randomArr.push(i);
        }
        // randomArr = randomArr.sort(() => {
        //     return Math.random() - 0.5;
        // });
        array.forEach((element, index) => {
            const value = randomArr[index] + 1;
            console.log(element.index + 1, value)
            element.setValue(value);
        });
    }

    onClickCard(card) {
        if (this.cardFlipped == 0) { gameSong.pause() }
        if (!this.canClick) return;
        if (card === this.firstCard) return;
        if (this.firstCard === null) {
            cardOpen.play();
            this.firstCard = card;
            // * Open firstCard
            this.firstCard.open()
            console.log("firstCard", card.value);
        } else {
            this.canClick = false;
            this.secondCard = card;
            // * Open secondCard
            this.secondCard.open();
            console.log("secondCard", card.value);
            // * CompareCard
            this.compareCard();
        }
    }
    compareCard() {
        this.canClick = false;
        if (this.firstCard.value === this.secondCard.value) {
            matched.play();
            this.cardFlipped += 1;
            this.plusScore(10);
            setTimeout(() => {
                this.firstCard.hide();
                this.secondCard.hide();
                console.log(true, "Hide");
            }, 500)
        } else {
            matchFail.play();
            this.minusScore(10);
            setTimeout(() => {
                this.firstCard.close();
                this.secondCard.close();
                console.log(false, "Close");
            }, 500)
        }
        setTimeout(() => {
            this.canClick = true;
            this.firstCard = null;
            this.secondCard = null;
            console.log("reset var")
        }, 2000)
    }
    resetGame() {
        const cards = document.body.getElementsByTagName("div")[0];
        cards.innerHTML = "";
        this._init();
    }
    gamePopup() {
        const cards = document.body.getElementsByTagName("div")[0];
        cards.innerHTML = "";
        this.textPopup = new Label();
        const POPUP_STYLE = {
            color: 'red',
            width: '100%',
            textAlign: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
            backgroundColor: '#fff'
        }
        this.textPopup.style = POPUP_STYLE;
        this.addChild(this.textPopup);
        return this.textPopup
    }
    gameLose() {
        lose.play()
        const gameLoseText = this.gamePopup();
        gameLoseText.text = "GAME OVER!";
        this._createReplayGameBtn();
    }
    gameWin() {
        win.play();
        const gameWinText = this.gamePopup();
        gameWinText.text = "WIN! YOUR SCORE: " + this.score;
        this._createReplayGameBtn();
        // let master = gsap.timeline();
        // master.add(this.control());
    }
    control() {
        // let bg = game.elm.getElementsByTagName("div");
        const dots = gsap.timeline(),
            qty = 80,
            duration = 2.5,
            colors = ["#91e600", "#84d100", "#73b403", "#528003"];

        for (let i = 0; i < qty; i++) {
            const dot = new Node();
            dot.elm.style.position = "absolute";
            dot.elm.style.backgroundColor = "#91e600";
            dot.elm.style.width = "50px";
            dot.elm.style.height = "50px";
            dot.elm.style.borderRadius = "50%";
            this.addChild(dot);
            console.log(dot);
            // dot.appendTo(bg)[0];
            const color = colors[(Math.random() * colors.length) | 0];
            gsap.set(dot.elm.style, { backgroundColor: color, x: 300, y: 700 });
            const delay = Math.random() * duration;
            dots.to(dot, { duration: duration, physics2D: { velocity: Math.random() * 400 + 150, angle: Math.random() * 40 + 250, gravity: 500 } }, delay);
        }
        return dots;
    }
}

let game = new Game();
game.width = 540;
game.height = 480;
game.elm.style.position = "relative";
game.elm.style.margin = "auto";
document.body.appendChild(game.elm);

let gameSong = new Audio("./sounds/game-song.mp3");
let lose = new Audio("./sounds/gamers-fail-game.mp3");
let win = new Audio("./sounds/you-win.mp3");
let matchFail = new Audio("./sounds/match-fail.mp3");
let matched = new Audio("./sounds/matched-song.mp3");
let cardOpen = new Audio("./sounds/menu-open.mp3");
// let bg = game.elm.getElementsByTagName("div");
// let master = gsap.timeline();
//     master.add(game.control());