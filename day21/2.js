scripts.day21_2 = async () => {
    /** @type {string} */ 
    let data = (await getFile('day21/input.txt'));
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

    const expand = (monkey) => {
        if (monkey.id == 'humn') return '$';
        if (monkey.value != null) return monkey.value;

        return `(${monkey.rawExpression
            .replace(monkey.lhs.id, expand(monkey.lhs))
            .replace(monkey.rhs.id, expand(monkey.rhs))})`;
    }

    data = '';

    let root = monkies.find(m => m.id == 'root');
    let expressions = [expand(root.lhs), expand(root.rhs)];
    let expression = expressions.find(x => x.includes('$'));
    let value = eval(expressions.find(x => x != expression));

    let x1 = 0;
    let x2 = 1;
    let y1 = eval(expression.replace('$', x1));
    let y2 = eval(expression.replace('$', x2));
    while (y2 != value) {
        let m = (y2 - y1) / (x2 - x1);
        let b = y2 - (m * x2);
        let x3 = Math.round((value - b) / m);
        let y3 = eval(expression.replace('$', x3));
        x1 = x2;
        x2 = x3;
        y1 = y2;
        y2 = y3;
    }
    

    terminal.textContent = `Human must shout ${x2}`;
}