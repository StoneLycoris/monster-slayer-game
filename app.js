const getRandomValue = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
};

const app = Vue.createApp({
	data() {
		return {
			healthPlayer: 100,
			healthMonster: 100,
			currentRound: 0,
			winner: null,
			logMessages: [],
		};
	},
	computed: {
		monsterBarStyles() {
			if (this.healthMonster < 0) {
				this.healthMonster = 0;
				return { width: "0%" };
			}
			return { width: this.healthMonster + "%" };
		},
		playerBarStyles() {
			if (this.healthPlayer < 0) {
				this.healthPlayer = 0;
				return { width: "0%" };
			}
			return { width: this.healthPlayer + "%" };
		},
		isPossibleSpecialAttack() {
			return this.currentRound % 3 !== 0;
		},
		isPossibleHeal() {
			return this.currentRound === 0 || this.currentRound % 2 !== 0;
		},
	},
	watch: {
		healthPlayer(value) {
			if (value <= 0 && this.healthMonster <= 0) {
				// A draw
				this.winner = "draw";
			} else if (value <= 0) {
				//Player Lost
				this.winner = "monster";
			}
		},
		healthMonster(value) {
			if (value <= 0 && this.healthPlayer <= 0) {
				// A draw
				this.winner = "draw";
			} else if (value <= 0) {
				//Monster Lost
				this.winner = "player";
			}
		},
	},
	methods: {
		startGame() {
			this.healthPlayer = 100;
			this.healthMonster = 100;
			this.winner = null;
			this.currentRound = 0;
			this.logMessages = [];
		},
		attackMonster() {
			this.currentRound++;

			const attackValue = getRandomValue(5, 12);
			this.healthMonster -= attackValue;

			this.addLogMessage("player", "attack", attackValue);

			this.attackPlayer();
		},
		attackPlayer() {
			const attackValue = getRandomValue(8, 15);
			this.healthPlayer -= attackValue;
			this.addLogMessage("monster", "attack", attackValue);
		},
		specialAttackMonster() {
			this.currentRound++;

			const attackValue = getRandomValue(10, 25);
			this.healthMonster -= attackValue;

			this.addLogMessage("player", "special-attack", attackValue);

			this.attackPlayer();
		},
		healPlayer() {
			this.currentRound++;

			const healValue = getRandomValue(8, 20);
			if (this.healthPlayer + healValue > 100) {
				this.healthPlayer = 100;
			} else {
				this.healthPlayer += healValue;
			}

			this.addLogMessage("player", "heal", healValue);

			this.attackPlayer();
		},
		surrender() {
			this.addLogMessage("player", "surrender");
			this.winner = "monster";
		},
		addLogMessage(character, action, value) {
			this.logMessages.unshift({
				character,
				action,
				value,
			});
		},
	},
});

app.mount("#game");
