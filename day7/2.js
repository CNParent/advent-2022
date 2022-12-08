scripts.day7_2 = async () => {
    let data = (await getFile('day7/input.txt')).split('$');

    let space = 70000000;
    let required = 30000000;
    let directory = (name = "/", parent = null) => {
        let d = { parent, name, files: [], dirs: [] };
        d.getAllDirs = () => d.dirs.reduce((a,b) => a.concat(b.getAllDirs()), []).concat(d.dirs);
        d.getSize = () => d.files.reduce((a,b) => a + b.size, 0) + d.dirs.reduce((a,b) => a + b.getSize(), 0);
        return d;
    };

    let root = directory();
    let currentDir = root;

    let findOrCreate = (name = "") => {
        let dir = currentDir.dirs.find(d => d.name == name);
        if (!dir) {
            dir = directory(name, currentDir);
            currentDir.dirs.push(dir);
        }

        return dir;
    }

    data.forEach(command => {
        let lines = command.split('\r\n').map(l => l.split(' '));
        if (lines[0][1] == 'cd') {
            if (lines[0][2] == '..') {
                currentDir = currentDir.parent;
            } else {
                let dir = findOrCreate(lines[0][2]);
                currentDir = dir;
            }
        } else if (lines[0][1] == 'ls') {
            for(let i = 1; i < lines.length; i++) {
                if (lines[i][0] == 'dir') {
                    findOrCreate(lines[i][1]);
                } else if (Number.parseInt(lines[i][0]) != NaN) {
                    currentDir.files.push({ name: lines[i][1], size: Number(lines[i][0]) });
                }
            }
        }
    });

    let used = root.getSize();
    let need = used + required - space;
    let dirs = root.getAllDirs();
    let candidates = dirs.filter(d => d.getSize() >= need);
    candidates.sort((a,b) => a.getSize() - b.getSize());
    terminal.textContent = `The size of the smallest directory that can be deleted to make space for the update is ${candidates[0].getSize()}`;
}