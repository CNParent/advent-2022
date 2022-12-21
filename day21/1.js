scripts.day21_1 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day21/input.txt'));
    const monkies = data.split('\r\n').map(d => {
        let values = d.split(': ');
        return { id: values[0], rawExpression: values[1], value: null, operator: '', lhs: null, rhs: null };
    });

    monkies.forEach(monkey => {
        if (parseInt(monkey.rawExpression)) monkey.value = Number(monkey.rawExpression);
        else {
            let expression = monkey.rawExpression.split(' ');
            monkey.lhs = monkies.find(m => m.id == expression[0]);
            monkey.rhs = monkies.find(m => m.id == expression[2]);
            monkey.operator = expression[1];

            if (monkey.lhs == null || monkey.rhs == null)
                throw `Monkey with id ${monkey.id} does not have a valid expression`;
        }

        return monkey;
    });

    const compute = (monkey) => {
        if (monkey.value) return monkey.value;

        if (monkey.operator == '+') return compute(monkey.lhs) + compute(monkey.rhs);
        else if (monkey.operator == '-') return compute(monkey.lhs) - compute(monkey.rhs);
        else if (monkey.operator == '*') return compute(monkey.lhs) * compute(monkey.rhs);
        else if (monkey.operator == '/') return compute(monkey.lhs) / compute(monkey.rhs);

        throw `Monkey with id ${monkey.id} had neither a value or valid expression.`;
    }

    let root = monkies.find(m => m.id == 'root');
    let result = compute(root);

    terminal.textContent = `Monkey 'root' shouted ${result}`;
}