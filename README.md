# jfpe
A simple [format-preserving encryption](https://en.wikipedia.org/wiki/Format-preserving_encryption) (FPE) implement by Node.js.

> In cryptography, format-preserving encryption (FPE), refers to encrypting in such a way that the output (the ciphertext) is in the same format as the input (the plaintext). The meaning of "format" varies. Typically only finite domains are discussed, for example:
> 
> - To encrypt a 16-digit credit card number so that the ciphertext is another 16-digit number.
> - To encrypt an English word so that the ciphertext is another English word.
> - To encrypt an n-bit number so that the ciphertext is another n-bit number (this is the definition of an n-bit block cipher).
> 
> For such finite domains, and for the purposes of the discussion below, the cipher is equivalent to a permutation of N integers {0, ... , N−1} where N is the size of the domain.


By default, this lib will encrypt & decrypt by domain of `0-9A-Za-z` and 5 prefix-`iv`s.

## Install
```
$ npm i -S jfpe
```

## Usage
```
const FPE = require('jfpe')

const fpe = new FPE('my-secret-key')
const encrypted = fpe.encrypt('Hello_World-123')
const decrypted = fpe.decrypt(encrypted)

console.log('encrypted:', encrypted) // HOJBBGwSGXBKv981
console.log('decrypted:', decrypted) // hello_world-123
```

## Customize `domain` and `iv` list
```
const myDomain = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
const myIvs = [
  '31c10d883e45c3cde515ba968140aae3',
  '2fc1bee21fdd7335242efe6f5a46a7be',
  '7eb06befa9b2d8fa5ee225ccd27d8039'
]
const fpe = new FPE('my-secret-key_custom', {
  domain: myDomain,
  ivs: myIvs
})
const encrypted = fpe.encrypt('helloworld123')
console.log(encrypted)
```

While, `iv` random bytes can be gen by:
```
const iv = crypto.randomBytes(16).toString('hex') // be6794609d987fdab5bcc754899c6ca0
```
