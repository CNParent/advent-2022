scripts.day6_2 = async () => {
    let data = (await getFile('day6/input.txt')).split('');
    let i = 14;
    while(i < data.length) {
        let s = new Set(data.slice(i-14,i+1));
        if (s.size == 14) break;

        i++;
    }

    terminal.textContent = `Start-of-packet received at ${i+1}`;
}