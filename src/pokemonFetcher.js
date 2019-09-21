class pokemonFetcher {
    constructor(args) {
        this.args = args;
    }

    // Reg Shiny
    normalShiny(pokemonNameLower, PID) {
        if (this.args[0].toLowerCase() == 'shiny' && this.args[1].toLowerCase() == pokemonNameLower && !this.args[2] && !this.args[3]) {
            console.log('Regular Shiny Poke');
            let pokemonObject;
            return pokemonObject = require(`../assets/info/${PID}_${pokemonNameLower}.js`).info;
        }
    }

    normalPokemon(pokemonNameLower, PID) {
        // Reg
        if (this.args[0].toLowerCase() != 'mega' && this.args[0].toLowerCase() != 'shiny' && !this.args[1] && !this.args[2] && !this.args[3]) {
            console.log('Regular Poke');
            let pokemonObject;
            return pokemonObject = require(`../assets/info/${PID}_${pokemonNameLower}.js`).info;
        }
    }

}

exports.pokemonFetcher = pokemonFetcher;