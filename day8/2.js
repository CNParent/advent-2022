scripts.day8_2 = async () => {
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
    
        let getScore = () => {
            let h = data[y][x];
            let visibilities = [0,0,0,0];
            for(let j = y - 1; j >= 0; j--) {
                visibilities[0]++;
                if (data[j][x] >= h) break;
            }
    
            for(let j = y + 1; j < height; j++) {
                visibilities[1]++;
                if (data[j][x] >= h) break;
            }
    
            for(let i = x - 1; i >= 0; i--) {
                visibilities[2]++;
                if(data[y][i] >= h) break;
            }
    
            for(let i = x + 1; i < width; i++) {
                visibilities[3]++;
                if (data[y][i] >= h) break;
            }
    
            return visibilities.reduce((a,b) => a * b, 1);
        };

        return {
            x,
            y,
            h,
            isHidden,
            getScore
        }
    }

    let trees = [];
    for(let j = 0; j < height; j++) {
        for(let i = 0; i < width; i++) {
            trees.push(tree(i, j));
        }
    }

    let scores = trees.map(t => t.getScore());
    let max = Math.max(...scores);
    terminal.textContent = `The best scenic score is ${max}`;
}