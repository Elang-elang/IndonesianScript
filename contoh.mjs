const readline = await import("readline")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// Fungsi untuk bertanya (Promise-based)
function ask(question) { return new Promise((resolve) => { rl.question(question, (answer) => { resolve(answer); }); }); } 
export { ask, rl }
