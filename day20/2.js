scripts.day20_2 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day20/input.txt'));
    const key = 811589153;

    const mixer = data.split('\r\n').map(x => ({ value: Number(x) * key, before: null, after: null }));

    for (let i = 0; i < mixer.length; i++) {
        let n = mixer[i];
        n.before = mixer[i - 1];
        n.after = mixer[i + 1];
        if (!n.before) n.before = mixer[mixer.length - 1];
        if (!n.after) n.after = mixer[0];
    }
    
    const mix = () => {
        mixer.forEach(item => {
            if (item.value == 0) return;

            let limit = item.value % (mixer.length - 1);
            if (item.value > 0) {
                for (let i = 0; i < limit; i++) {
                    move(item, item.after);
                }
            } else {
                for (let i = 0; i > limit; i--) {
                    move(item.before, item);
                }
            }

        });
    }

    const move = (a, b) => {
        let left = a.before;
        let right = b.after;
        left.after = b;
        b.after = a;
        a.after = right;
        right.before = a;
        a.before = b;
        b.before = left;
    }

    for (let i = 0; i < 10; i ++) {
        mix();
    }

    let node = mixer.find(x => x.value == 0);
    let total = 0;
    for (let i = 1; i <= 3000; i += 1) {
        node = node.after;
        if (i % 1000 == 0) total += node.value;
    }

    terminal.textContent = `Sum of grove coordinates is ${total}`;
}