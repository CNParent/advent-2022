scripts.day10_2 = async () => {
    /** @type {string} */ 
    let data = (await getFile('day10/input.txt'));
    let instructions = data.split('\r\n').map(x => {
        let values = x.split(' ');
        let instruction = { op: values[0], value: 0 };
        if (values[1]) instruction.value = Number(values[1]);
        
        return instruction;
    });

    let display = () => {

        let output = '';

        let draw = () => {
            let column = cycles % 40;
            if (column == 0 && cycles != 0) {
                output += '\r\n';
            }

            if (column >= registerX - 1 && column <= registerX + 1) {
                output += '#'
            } else {
                output += '.'
            }
        }

        let next = () => {
            if (instructions.length == 0) return null;

            let n = { instruction: instructions.splice(0, 1)[0], delay: 0 };
            if (n.instruction.op == 'noop') n.delay = 1;
            else if (n.instruction.op == 'addx') n.delay = 2;

            return n;
        }

        let execute = () => {
            if (pending.instruction.op == 'noop') return;
            else if (pending.instruction.op == 'addx') {
                registerX += pending.instruction.value;
            }
        };
        
        let run = () => {
            while(pending) tick();
        }

        let tick = () => {
            draw();
            cycles++;
            if (!pending) return;

            pending.delay--;
            if (pending.delay > 0) return;

            execute();
            pending = next();
        };

        let pending = next();
        let registerX = 1;
        let cycles = 0;

        let getX = () => registerX;
        let getCycles = () => cycles;
        let getOutput = () => output;

        return {
            getCycles,
            getOutput,
            getX,
            tick,
            run
        };
    };

    let screen = display();
    let waitFor = (tick = 0) => {
        while(screen.getCycles() < tick)
            screen.tick();
    }

    screen.run();
    terminal.textContent = `${screen.getOutput()}`;
}