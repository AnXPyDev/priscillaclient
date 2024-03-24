const b = Buffer.alloc(4);

b.writeInt32LE(12);

console.log(b.toString('hex'));

b.writeInt32LE(16);

console.log(b.toString('hex'));

console.log(b.length);