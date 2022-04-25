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
        gameSound.play();
        this._createCards();
        this._createScore();
    }
    _createCards() {
        this.cards = [];
        for (let index = 0; index < 20; index++) {
            let card = new Card(index);
            const CARD_STYLE = {
                borderRadius: '5px',
                border: '2px solid rgb(255, 255, 255)',
                opacity: 0
            };
            Object.assign(card.elm.style, CARD_STYLE);
            card.width = 100;
            card.height = 100;
            card.x = (505 - 100) / 2;
            card.y = (400 - 100) / 2;
            card.elm.addEventListener("click", this.onClickCard.bind(this, card));
            this.cards.push(card);
        }
        this.shuffleCards(this.cards);

    }
    _fadeOutCards() {
        this.canClick = false;
        for (let i = 19; i >= 0; i--) {
            this.addChild(this.cards[i]);
            TweenMax.fromTo(this.cards[i], 0.2, { opacity: 0 },
                {
                    ease: Back.easeOut.config(6),
                    opacity: 1,
                    delay: (20 - i) * 0.1
                });
            TweenMax.fromTo(this.cards[i].cover, 2, { opacity: 0 },
                {
                    ease: Back.easeOut.config(6),
                    opacity: 1,
                    delay: (20 - i) * 0.1
                });
            if (i == 0) {
                TweenMax.fromTo(this.cards[i].cover, 1, { opacity: 0 }, {
                    ease: Back.easeOut.config(6),
                    opacity: 1,
                    delay: (20 - i) * 0.1,
                    onComplete: () => {
                        this._animationMoveCards();
                    }
                });
            }
        }
    }
    _animationMoveCards() {
        for (let i = 0; i < 20; i++) {
            let row = i % 5;
            let col = Math.floor(i / 5);
            TweenMax.to(this.cards[i], 0.5, {
                ease: Back.easeOut.config(6),
                x: row * 110,
                y: col * 110,
                delay: i * 0.1
            })
        };
        setTimeout(() => {
            this.canClick = true;
        }, 3000);
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
        if (this.cardFlipped === 10) {
            setTimeout(() => {
                this.gameWin();
            }, 1500)
        };
    }
    minusScore(penaltyScore) {
        this.animationScore(this.score, this.score - penaltyScore);
        this.score = this.score - penaltyScore;
        if (this.score === 0) {
            setTimeout(() => {
                this.gameLose();
            }, 1000)
        };
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
            const value = randomArr[index];
            console.log(element.index + 1, value)
            element.setValue(value);
        });
        this._fadeOutCards();
    }

    onClickCard(card) {
        gameSound.pause();
        if (!this.canClick) return;
        if (card === this.firstCard) return;
        if (this.firstCard === null) {
            cardOpenSound.play();
            this.firstCard = card;
            this.firstCard.open()
            console.log("firstCard", card.value);
        } else {
            this.canClick = false;
            this.secondCard = card;
            this.secondCard.open();
            cardOpenSound.play();
            console.log("secondCard", card.value);
            this.compareCard();
        }
    }
    compareCard() {
        this.canClick = false;
        if (this.firstCard.value === this.secondCard.value) {
            this.cardFlipped += 1;
            this.plusScore(10);
            setTimeout(() => {
                this.firstCard.hide();
                this.secondCard.hide();
                setTimeout(() => {
                    matchedSound.play();
                }, 500);
                console.log(true, "Hide");
            }, 500)
        } else {
            this.minusScore(10);
            setTimeout(() => {
                this.firstCard.close();
                this.secondCard.close();
                setTimeout(() => {
                    matchFailSound.play();
                }, 500)
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
    _removeCards() {
        this.children.forEach((element, index) => {
            element.elm.remove()
        });
    }
    resetGame() {
        this,this._removeCards();
        this._init();
    }
    gamePopup() {
        this._removeCards();
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
        gameOverSound.play()
        const gameLoseText = this.gamePopup();
        gameLoseText.text = "GAME OVER!";
        this._createReplayGameBtn();
    }
    gameWin() {
        gameWinSound.play();
        const gameWinText = this.gamePopup();
        gameWinText.text = "WIN! YOUR SCORE: " + this.score;
        this._createReplayGameBtn();
        this.animationWin();
    }
    animationWin() {
        var total = 70, container = game, w = game._width, h = game.height;
        for (let i = 0; i < total; i++) {
            let div = new Node();
            div.elm.className = 'dot';
            container.addChild(div);
            TweenMax.set(div.elm, {
                x: R(0, w),
                y: R(-100, 100),
                opacity: 1,
                scale: R(0, 0.5) + 0.5,
                // backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/512px-Pok%C3%A9_Ball_icon.png)",
                // backgroundSize: '100px 100px',
                // backgroundPosition: 'center',
                // backgroundRepeat: 'no-repeat',
                backgroundColor: "hsl(" + R(170, 360) + ",50%,50%)"
            });
            animation(div);
        };
        function animation(elm) {
            TweenMax.to(elm, R(0, 5) + 3, { y: h, ease: Linear.easeNone, repeat: -1, delay: -5 });
            TweenMax.to(elm, R(0, 5) + 1, { x: '+=70', repeat: -1, yoyo: true, ease: Sine.easeInOut })
            TweenMax.to(elm, R(0, 1) + 0.5, { opacity: 0, repeat: -1, yoyo: true, ease: Sine.easeInOut })
        };
        function R(min, max) { return min + (Math.random() * (max - min)) };
    }
}

let game = new Game();
game.width = 540;
game.height = 480;
game.elm.style.position = "relative";
game.elm.style.margin = "auto";
document.body.appendChild(game.elm);

let gameSound = new Audio("./sounds/game-song.mp3");
let gameOverSound = new Audio("./sounds/gamers-fail-game.mp3");
let gameWinSound = new Audio("./sounds/you-win.mp3");
let matchFailSound = new Audio("./sounds/match-fail.mp3");
let matchedSound = new Audio("./sounds/matched-song.mp3");
let cardOpenSound = new Audio("./sounds/menu-open.mp3");