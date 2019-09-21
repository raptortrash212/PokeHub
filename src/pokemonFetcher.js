class pokemonFetcher {
    constructor(args) {
        this.args = args;
    }


    // Reg Shiny Checker
    checkNormalShiny(pokemonNameLower) {
        if (this.args[0].toLowerCase() == 'shiny' && this.args[1].toLowerCase() == pokemonNameLower && !this.args[2] && !this.args[3]) return true;
        else return false;
    }

    // Reg Checker
    checkNormalPokemon() {
        if (this.args[0].toLowerCase() != 'mega' && this.args[0].toLowerCase() != 'shiny' && !this.args[1] && !this.args[2] && !this.args[3]) return true;
    }

    // Reg Shiny
    normalShiny(pokemonNameLower, PID) {
        let pokemonObject;
        return pokemonObject = require(`../assets/info/${PID}_${pokemonNameLower}.js`).info;
    }

    normalPokemon(pokemonNameLower, PID) {
        let pokemonObject;
        return pokemonObject = require(`../assets/info/${PID}_${pokemonNameLower}.js`).info;
    }

}

exports.pokemonFetcher = pokemonFetcher;