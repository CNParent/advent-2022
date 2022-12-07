scripts.day6_1 = async () => {
    let data = (await getFile('day6/input.txt')).split('');
    let i = 3;
    while(i < data.length) {
        let s = new Set(data.slice(i-3,i+1));
        if (s.size == 4) break;

        i++;
    }

    terminal.textContent = `Start-of-packet received at ${i+1}`;
}