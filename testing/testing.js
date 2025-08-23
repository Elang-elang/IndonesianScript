// default sintax
import * as readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function menanyakan(...question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}
function menkonfirmasi(...question) {
    return new Promise((resolve) => {
        rl.question(`${question ? question : "apakah kamu setujuh? "} [Y/N]: `, (answer) => {
            return answer.toLowerCase() === 'y' ? true : false;
        });
    });
}
function panjang(item) {
    return item.length;
}
let hasil = "hasil_akhirs";
console.log(panjang(hasil));
