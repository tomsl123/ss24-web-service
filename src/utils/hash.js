import bcrypt from "bcrypt";

const hash = await bcrypt.hash('1234', 10);
console.log(hash);

console.log(await bcrypt.compare('1234', hash));