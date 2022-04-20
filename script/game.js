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
        this.score = 10;
        this.coutCardFlipped = 0;
        this._createCards();
        this._createScore();
    }
    _createCards() {
        this.cards = [];
        for (let index = 0; index < 20; index++) {
            let card = new Card(index);
            const CARD_STYLE = {
                transition: 'transform 0.5s ease-in-out 0s',
                transformStyle: 'preserve-3d',
                backgroundColor: 'rgb(38, 160, 218)',
                borderRadius: '5px',
                border: '2px solid rgb(255, 255, 255)'
            };
            Object.assign(card.elm.style, CARD_STYLE);
            card.width = 100;
            card.height = 100;
            let row = index % 5;
            let col = Math.floor(index / 5);
            card.x = row * 100;
            card.y = col * 100;
            card.elm.addEventListener("click", this.onClickCard.bind(this, card));
            this.addChild(card);
            this.cards.push(card);
        }
        this.shuffleCards(this.cards)
    }
    _createScore() {
        this.scoreText = new Label();
        const STYLE_SCORETEXT = {
            color: 'black',
            fontSize: '30px',
            lineHeight: 2,
            fontWeight: 500,
            width: "100%",
            textAlign: "center",
            borderRadius: "10px",
            backgroundColor: "#fff"
        };
        this.scoreText.style = STYLE_SCORETEXT;
        this.scoreText.y = 420;
        this.scoreText.text = "Score: " + this.score;

        this.addChild(this.scoreText);
    }
    _createPlayGameBtn() {
        this.btnPlayGame = new Label();
        this.btnPlayGame.elm.classList.add('btn-game');
        this.btnPlayGame.x = 90;
        this.btnPlayGame.y = 150;
        this.btnPlayGame.text = "PLAY GAME";
        this.btnPlayGame.elm.addEventListener("click", this._init.bind(this));
        this.addChild(this.btnPlayGame);
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
        const stepTime = Math.abs(Math.floor(500 / range));
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
        if (this.coutCardFlipped === 10) this.gameWin();
    }
    minusScore(penaltyScore) {
        this.animationScore(this.score, this.score - penaltyScore);
        this.score = this.score - penaltyScore;
        if (this.score === 0) this.gameLose();
    }

    shuffleCards(array) {
        // array = array.sort(() => {
        //     return Math.random() - 0.5
        // })
        array.forEach(element => {
            element.setValue(element.index % 10)
        });
    }

    onClickCard(card) {
        if (!this.canClick) return;
        if (card === this.firstCard) return;
        if (this.firstCard === null) {
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
            this.coutCardFlipped += 1;
            this.plusScore(10);
            setTimeout(() => {
                this.firstCard.hide();
                this.secondCard.hide();
                console.log(true, "Hide");
            }, 500)
        } else {
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
        }, 700)
    }
    resetGame() {
        const cards = document.body.getElementsByTagName("div")[0];
        cards.innerHTML = "";
        this.score = 10;
        this._init();
    }
    gamePopup() {
        const cards = document.body.getElementsByTagName("div")[0];
        cards.innerHTML = "";
        this.textPopup = new Label();
        const TEXTPOPUP_STYLE = {
            color: 'red',
            width: '100%',
            textAlign: 'center',
            fontSize: '50px',
            fontWeight: 'bold',
            backgroundColor: '#fff'
        }
        this.textPopup.style = TEXTPOPUP_STYLE;
        this.addChild(this.textPopup);
        return this.textPopup
    }
    gameLose() {
        // this.coutCardFlipped = 0;
        const gameLoseText = this.gamePopup();
        gameLoseText.text = "GAME OVER!";
        this._createReplayGameBtn();
    }
    gameWin() {
        // this.coutCardFlipped = 0;
        const gameWinText = this.gamePopup();
        gameWinText.text = "WIN! YOUR SCORE: " + this.score;
        this._createReplayGameBtn();
    }
}

let game = new Game();
game.width = 505;
game.height = 470;
game.elm.style.position = "relative";
game.elm.style.margin = "auto";

document.body.appendChild(game.elm);

