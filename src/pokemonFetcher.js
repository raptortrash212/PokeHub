const { forms } = require('../assets/formIndex');
const { generationChecker } = require('../src/generationChecker');

class pokemonFetcher {
    constructor(args, PID) {
        const GC = new generationChecker(PID);
        this.generation = GC.checkGeneration();
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

    // Other Forms Checker
    checkOtherForms() {
        if (forms.includes(this.args[0].toLowerCase()) == true && this.args[0].toLowerCase() != 'shiny' && !this.args[2] && !this.args[3]) return true;
        else return false;
    }

    // Other Forms Shiny Checker
    checkOtherFormsShiny() {
        if (this.args[1] && forms.includes(this.args[1].toLowerCase()) == true && this.args[0].toLowerCase() == 'shiny' && !this.args[2] && !this.args[3]) return true;
        else return false;
    }

    // Mega Checker
    checkNormalMega() {
        if (this.args[0].toLowerCase() != 'shiny' && this.args[0].toLowerCase() == 'mega' && !this.args[2] && !this.args[3]) return true;
        else return false;
    }

    // Shiny Mega Checker
    checkShinyMega() {
        if (this.args[0].toLowerCase() == 'shiny' && this.args[1].toLowerCase() == 'mega' && !this.args[3]) return true;
        else return false;
    }

    // Mega X/Y Checker
    checkNormalMegaXY() {
        if (this.args[2] && this.args[2].toLowerCase() == 'x' || this.args[2].toLowerCase() == 'y' && this.args[0].toLowerCase() != 'shiny') return true;
        else return false;
    }


    // Shiny Mega X/Y Checker
    checkShinyMegaXY() {
        if (this.args[3] && this.args[3].toLowerCase() == 'x' || this.args[3].toLowerCase() == 'y' && this.args[0].toLowerCase() == 'shiny') return true;
        else return false;
    }


    // Reg Shiny
    normalShiny(pokemonNameLower, PID) {
        let pokemonObject;
        return pokemonObject = require(`../assets/info/${this.generation}/${PID}_${pokemonNameLower}.js`).info;
    }

    // Normal Pokemon
    normalPokemon(pokemonNameLower, PID) {
        let pokemonObject;
        return pokemonObject = require(`../assets/info/${this.generation}/${PID}_${pokemonNameLower}.js`).info;
    }

    // Other Forms
    otherForms(pokemonNameLower, PID) {
        let pokemonObject;
        return pokemonObject = require(`../../assets/info/${this.generation}/${PID}_${this.args[0]}-${pokemonNameLower}.js`).info;
    }

    // Other Forms Shiny
    otherFormsShiny(pokemonNameLower, PID) {
        let pokemonObject;
        return pokemonObject = require(`../../assets/info/${this.generation}/${PID}_${this.args[1]}-${pokemonNameLower}.js`).info;
    }

    // Mega
    normalMega(pokemonNameLower, PID) {
        let pokemonObject;
        return pokemonObject = require(`../../assets/info/${this.generation}/${PID}_${this.args[0]}-${pokemonNameLower}.js`).info;
    }

    // Shiny Mega
    shinyMega(pokemonNameLower, PID) {
        let pokemonObject;
        return pokemonObject = require(`../../assets/info/${this.generation}/${PID}_${this.args[1]}-${pokemonNameLower}.js`).info;
    }

    // Mega X/Y
    normalMegaXY(pokemonNameLower, PID) {
        let pokemonObject;
        return pokemonObject = require(`../../assets/info/${this.generation}/${PID}_${this.args[0]}-${pokemonNameLower}-${this.args[2]}.js`).info;
    }

    // Shiny Mega X/Y
    shinyMegaXY(pokemonNameLower, PID) {
        let pokemonObject;
        return pokemonObject = require(`../../assets/info/${this.generation}/${PID}_${this.args[1]}-${pokemonNameLower}-${this.args[3]}.js`).info;
    }
}

exports.pokemonFetcher = pokemonFetcher;