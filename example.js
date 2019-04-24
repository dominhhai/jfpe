const FPE = require('./index')

const fpe = new FPE('my-secret-key')
const encrypted = fpe.encrypt('hello_world-123')
const decrypted = fpe.decrypt(encrypted)

console.log('encrypted:', encrypted) // HOJBBGwSGXBKv981
console.log('decrypted:', decrypted) // hello_world-123
