scripts.day11_1 = async () => {
    const rounds = 20;

    /** @type {string} */ 
    let data = (await getFile('day11/input.txt'));
    let monkies = data.split('\r\n\r\n').map(x => {
        let values = x.split('\r\n');
        let opValues = values[2].split('=')[1].split(' ');
        let testValues = values[3].split(' ');
        let trueValues = values[4].split(' ');
        let falseValues = values[5].split(' ');
        return {
            items: values[1].split(':')[1].split(',').map(i => Number(i)),
            opType: opValues[opValues.length - 2],
            opValue: opValues[opValues.length - 1],
            testValue: Number(testValues[testValues.length - 1]),
            ifTrue: Number(trueValues[trueValues.length - 1]),
            ifFalse: Number(falseValues[falseValues.length - 1]),
            inspections: 0
        };
    });

    let round = () => {
        for(let i = 0; i < monkies.length; i++) {
            let monkey = monkies[i];
            monkey.inspections += monkey.items.length;
            for(let j = 0; j < monkey.items.length; j++) {
                let value = monkey.opValue == 'old' ? monkey.items[j] : Number(monkey.opValue);
                if (monkey.opType == '+') monkey.items[j] += value;
                else if (monkey.opType == '*') monkey.items[j] *= value;

                monkey.items[j] = Math.floor(monkey.items[j] / 3);

                let toMonkey = monkies[monkey.ifFalse];
                if (monkey.items[j] % monkey.testValue == 0) toMonkey = monkies[monkey.ifTrue];

                toMonkey.items.push(monkey.items[j]);
            }

            monkey.items = [];
        }
    };

    for(let i = 0; i < rounds; i++)
        round();

    monkies.sort((a,b) => b.inspections - a.inspections);
    let monkeyBusiness = monkies[0].inspections * monkies[1].inspections;
    terminal.textContent = `Total amount of monkey business is ${monkeyBusiness}`;
}