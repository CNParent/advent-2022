scripts.day8_1 = async () => {
    /** @type {number[][]} */ 
    let data = (await getFile('day8/input.txt')).split('\r\n').map(x => x.split('').map(y => Number(y)));
    let width = data[0].length;
    let height = data.length;

    let tree = (x, y) => {

        let h = data[y][x];
        let isHidden = () => {
            if (x == 0 || y == 0 || x == width - 1 || y == height - 1) return false; // Trees on the edge are always visible
    
            let up = data.slice(0, y).map(r => r[x]);
            let down = data.slice(y + 1, height).map(r => r[x]);
            let left = data[y].slice(0, x);
            let right = data[y].slice(x + 1, width);
            return up.filter(t => t >= h).length > 0 &&
                down.filter(t => t >= h).length > 0 &&
                left.filter(t => t >= h).length > 0 &&
                right.filter(t => t >= h).length > 0;
        };

        return {
            x,
            y,
            h,
            isHidden
        }
    }

    let trees = [];
    for(let j = 0; j < height; j++) {
        for(let i = 0; i < width; i++) {
            trees.push(tree(i, j));
        }
    }

    let visibleCount = trees.filter(t => !t.isHidden()).length;
    terminal.textContent = `There are ${visibleCount} visible trees from outside the grid`;
}