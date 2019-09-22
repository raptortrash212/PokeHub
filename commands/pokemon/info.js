// Import modules
const { pokemonFetcher } = require('../../src/pokemonFetcher.js');
const { Command } = require('discord-akairo');
const { get } = require('snekfetch');

const captialiseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const { forms } = require('../../assets/formIndex');

// Create main command class
class InfoCommand extends Command {
    constructor() {
        super('info', {
            category: 'pokemon',
            aliases: ['info'],
            typing: true,
            args: [
            {
                id: 'pokemon',
                type: 'string',
                match: 'content'
            }]
        });
    }

    // Command execution func
    async exec(msg, args) {
        // Create variable for measuring fetch time
        const startTime = Date.now();

        const argss = args.pokemon.split(' ');
        console.log(argss);

        // Pokemon name stuff
        let pokemonName;
        if (argss.length == 2) {
            pokemonName = argss[1];
        } else if (argss.length == 3) {
            if (argss[0] != 'shiny') pokemonName = argss[1];
            else pokemonName = argss[2];
        } else if (argss.length == 4) {
            pokemonName = argss[2];
        } else { pokemonName = argss[0]; }

        const pokemonNameLower = pokemonName.toLowerCase();
        let r;
        let PID;
        let pokeObj;

        // Female or Male Pokemon (needs to be seperate)
        if (pokemonName[pokemonName.length - 1] == 'F' || pokemonName[pokemonName.length - 1] == 'M') {
            if (pokemonName[pokemonName.length - 1] == 'M') {
                pokemonName = pokemonName.toLowerCase().slice(0, pokemonName.length - 1);
                r = await get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}-m`);
                pokeObj = r.body;
                PID = pokeObj.id;
            } else {
                pokemonName = pokemonName.toLowerCase().slice(0, pokemonName.length - 1);
                r = await get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}-f`);
                pokeObj = r.body;
                PID = pokeObj.id;
            }
        }

        // Pokemon ID for the actual file fetching
        else {
            r = await get(`https://pokeapi.co/api/v2/pokemon/${pokemonNameLower}`);
            pokeObj = r.body;
            PID = pokeObj.id;
        }


        if (PID.toString().length == 1) PID = `00${PID}`;
        else if (PID.toString().length == 2) PID = `0${PID}`;
        else PID = pokeObj.id;

        // Fetch Pokemon object
        let pokemonObject;
        const pkmnFetcher = new pokemonFetcher(argss);

        // Reg Shiny
        if (pkmnFetcher.checkNormalShiny(pokemonNameLower) == true) pokemonObject = pkmnFetcher.normalShiny(pokemonNameLower, PID);

        // Reg Pokemon
        else if (pkmnFetcher.checkNormalPokemon() == true) pokemonObject = pkmnFetcher.normalPokemon(pokemonNameLower, PID);

        // Other Forms
        else if (pkmnFetcher.checkOtherForms() == true) pokemonObject = pkmnFetcher.otherForms(pokemonNameLower, PID);

        // Other Forms Shiny
        else if (pkmnFetcher.checkOtherFormsShiny() == true) pokemonObject = pkmnFetcher.otherFormsShiny(pokemonNameLower, PID);

        // Mega
        else if (pkmnFetcher.checkNormalMega() == true) pokemonObject = pkmnFetcher.normalMega(pokemonNameLower, PID);

        // Shiny Mega
        else if (pkmnFetcher.checkShinyMega() == true) pokemonObject = pkmnFetcher.shinyMega(pokemonNameLower, PID);

        // Mega X/Y
        else if (pkmnFetcher.checkNormalMegaXY() == true) pokemonObject = pkmnFetcher.normalMegaXY(pokemonNameLower, PID);

        // Shiny Mega X/Y
        else if (pkmnFetcher.checkShinyMegaXY() == true) pokemonObject = pkmnFetcher.shinyMegaXY(pokemonNameLower, PID);

        // Other fetch time related variable
        const endTime = Date.now();

        // Fetch time
        const fetchTime = Math.round(endTime - startTime);

        let gif = pokemonObject.gif;
        let color = pokemonObject.colorHex;
        let colorName = pokemonObject.color;

        // Checking if they wanted shiny gif
        if (argss[0] == 'shiny' || argss[0] == 'Shiny' || argss[1] == 'shiny' || argss[1] == 'Shiny') gif = pokemonObject.gifShiny, color = pokemonObject.colorHexShiny, colorName = pokemonObject.colorShiny;

        // Creating embed to send to Discord
        const pokemonInfoEmbed = this.client.util.embed()
            .setAuthor('PokéHub', this.client.user.avatarURL({ size: 1024 }), 'https://discordapp.com/oauth2/authorize?client_id=611554251918934016&permissions=313408&scope=bot')
            .setColor(color)
            .setFooter(`Data fetched in ${fetchTime}ms.`)
            .setImage(gif);

        // Adding Pokemon Name
        pokemonInfoEmbed.addField('Species', pokemonObject.species, true);

        // Adding Pokemon Type
        pokemonInfoEmbed.addField('Type', pokemonObject.types, true);

        // Adding Pokemon Color
        pokemonInfoEmbed.addField('Color', colorName, true);

        // Adding height & weight
        pokemonInfoEmbed.addField('Height', `${pokemonObject.height}m`, true);
        pokemonInfoEmbed.addField('Weight', `${pokemonObject.weight}lbs`, true);

        // Adding Pokedex Entry
        pokemonInfoEmbed.addField('PokeDex Entry', pokemonObject.pokedexEntry, true);

        // Adding gender ratio
        const genRatio = `Male: ${pokemonObject.genderRatio.M * 100}%\nFemale: ${pokemonObject.genderRatio.F * 100}%`;

        if (pokemonObject.genderRatio.M == 0 || pokemonObject.genderRatio.M == 0.00 || pokemonObject.genderRatio.F == 0 || pokemonObject.genderRatio.F == 0.00) {
            pokemonInfoEmbed.addField('Gender Ratio', 'This Pokemon is genderless', true); // Genderless
        } else pokemonInfoEmbed.addField('Gender Ratio', genRatio, true); // Normal Gender ratio

        // Adding catch rate
        pokemonInfoEmbed.addField('Catch Rate', `${pokemonObject.catchRate.integer} (${pokemonObject.catchRate.percentage})`, true);

        // Adding Pokemon abilities
        let [abilityOne, abilityTwo, abilityHidden, abilityMega] = ['', '', '', ''];

        if (Object.keys(pokemonObject.abilities).length == 1) {
            abilityOne = pokemonObject.abilities['0'];

            if (pokemonObject.abilities['M']) abilityMega = pokemonObject.abilities['M'];
        }

        else if (Object.keys(pokemonObject.abilities).length == 2) {
            abilityOne = pokemonObject.abilities['0'];
            abilityHidden = pokemonObject.abilities['H'];

            if (pokemonObject.abilities['M']) abilityMega = pokemonObject.abilities['M'];

            abilityHidden = `*${abilityHidden}*`;
            abilityMega = `**${abilityMega}**`;
        }

        else if (Object.keys(pokemonObject.abilities).length == 3) {
            abilityOne = pokemonObject.abilities['0'];
            abilityTwo = pokemonObject.abilities['1'];
            abilityHidden = pokemonObject.abilities['H'];

            if (pokemonObject.abilities['M']) abilityMega = pokemonObject.abilities['M'];

            abilityHidden = `*${abilityHidden}*`;
            abilityMega = `**${abilityMega}**`;
        }

        // 1 ability
        if (abilityOne && !abilityTwo && !abilityHidden) pokemonInfoEmbed.addField('Ability', abilityOne, true);

        // 1 ability + hidden
        else if (abilityOne && !abilityTwo && abilityHidden) pokemonInfoEmbed.addField('Abilities', `${abilityOne}, ${abilityHidden}`, true);

        // 1 ability + hidden + mega
        else if (abilityOne && !abilityTwo && abilityHidden && abilityMega) pokemonInfoEmbed.addField('Abilities', `${abilityOne}, ${abilityMega}, ${abilityHidden}`, true);

        // 2 abilities + hidden
        else if (abilityOne && abilityTwo && abilityHidden) pokemonInfoEmbed.addField('Abilities', `${abilityOne}, ${abilityTwo}, ${abilityHidden}`, true);

        // 2 abilities + hidden + mega
        else if (abilityOne && !abilityTwo && abilityHidden && abilityMega) pokemonInfoEmbed.addField('Abilities', `${abilityOne}, ${abilityTwo}, ${abilityHidden}, ${abilityMega}`, true);


        // Adding Base Stats
        pokemonInfoEmbed.addField('Base Stats', `HP: ${pokemonObject.baseStats.hp}\nATK: ${pokemonObject.baseStats.atk}\nDEF: ${pokemonObject.baseStats.def}\nSP. ATK: ${pokemonObject.baseStats.spAtk}\nSP. DEF: ${pokemonObject.baseStats.spDef}\nSPD: ${pokemonObject.baseStats.spd}`);

        // Adding evolutions
        let [evolvesFrom, evolvesTo] = [{}, {}];

        if (pokemonObject.evolvesFrom) {
            evolvesFrom = {
                species: pokemonObject.evolvesFrom.species,
                level: pokemonObject.evolvesFrom.level,
                triggeredBy: pokemonObject.evolvesFrom.triggeredBy
            };

            if (evolvesFrom.level == null) {
                pokemonInfoEmbed.addField('Evolves From', `**${evolvesFrom.species}**\nTriggered By: ${evolvesFrom.triggeredBy}`, true);
            } else {
                pokemonInfoEmbed.addField('Evolves From', `**${evolvesFrom.species}** @ LVL ${evolvesFrom.level}`, true);
            }
        }

        if (pokemonObject.evolvesTo) {
            evolvesTo = {
                species: pokemonObject.evolvesTo.species,
                level: pokemonObject.evolvesTo.level,
                triggeredBy: pokemonObject.evolvesTo.triggeredBy
            };

            if (evolvesTo.level == null) {
                pokemonInfoEmbed.addField('Evolves To', `**${evolvesTo.species}**\nTriggered By: ${evolvesTo.triggeredBy}`, true);
            } else {
                pokemonInfoEmbed.addField('Evolves To', `**${evolvesTo.species}** @ LVL ${evolvesTo.level}`, true);
            }
        }

        // Adding egg groups
        if (pokemonObject.eggGroups.length == 1) {
            pokemonInfoEmbed.addField('Egg Group', pokemonObject.eggGroups[0], true);
        } else if (pokemonObject.eggGroups.length == 2) {
            pokemonInfoEmbed.addField('Egg Groups', `${pokemonObject.eggGroups[0]} and ${pokemonObject.eggGroups[1]}`, true);
        }

        // Adding hatch time
        pokemonInfoEmbed.addField('Hatch Time', pokemonObject.hatchTime, true);

        // Send Embed
        msg.channel.send(pokemonInfoEmbed);
    }
}

module.exports = InfoCommand;