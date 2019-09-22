class generationChecker {
    constructor(PID) {
        this.PID = PID;
    }

    checkGeneration() {
        let generation;

        // Generation 1
        if (this.PID >= 1 && this.PID <= 151) return generation = 'Gen 1';

        // Generation 2
        if (this.PID >= 152 && this.PID <= 251) return generation = 'Gen 2';

        // Generation 3
        if (this.PID >= 252 && this.PID <= 386) return generation = 'Gen 3';

        // Generation 4
        if (this.PID >= 387 && this.PID <= 493) return generation = 'Gen 4';

        // Generation 5
        if (this.PID >= 494 && this.PID <= 649) return generation = 'Gen 5';

        // Generation 6
        if (this.PID >= 650 && this.PID <= 721) return generation = 'Gen 6';

        // Generation 7
        if (this.PID >= 722 && this.PID <= 809) return generation = 'Gen 7';
    }
}

exports.generationChecker = generationChecker;