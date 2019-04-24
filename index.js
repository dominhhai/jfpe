const crypto = require('crypto')
const DOMAIN = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'.split('')
const IVS = [
  '31c10d883e45c3cde515ba968140aae3',
  '2fc1bee21fdd7335242efe6f5a46a7be',
  '6c41f39df74298542c1e0afa71447914',
  '3d9092f6725739248e9d7673338512ad',
  '7eb06befa9b2d8fa5ee225ccd27d8039'
]

class FPE {
  constructor(secret, { domain = DOMAIN, ivs = IVS } = {}) {
    this.secret = secret
    if (!secret || typeof secret !== 'string') {
      throw new Error('fpe: secret must be a non-0-length string')
    }
    this.key = crypto
      .createHash('sha256')
      .update(String(secret))
      .digest()
    this.domain = domain
    this.ivs = ivs
  }

  encrypt(text) {
    this._validateInput(text)
    const ivChar = this.domain[
      Math.floor(this.domain.length * Math.random())
    ]
    const iv = Buffer.from(
      this.ivs[ivChar.charCodeAt(0) % this.ivs.length],
      'hex'
    )
    const table = this._buildCharMap(iv, true)
    const encrypted =
      ivChar +
      String(text)
        .split('')
        .map(c => table[c])
        .join('')
    this._validate(text, encrypted)

    return encrypted
  }

  decrypt(text) {
    this._validateInput(text)
    const txtStr = String(text)
    const iv = Buffer.from(
      this.ivs[txtStr.charCodeAt(0) % this.ivs.length],
      'hex'
    )
    const table = this._buildCharMap(iv)
    const decrypted = txtStr
      .substr(1)
      .split('')
      .map(c => table[c])
      .join('')
    this._validate(decrypted, text)

    return decrypted
  }

  _validateInput(text) {
    if (typeof text !== 'string' || text.length < 1) {
      throw new Error('value must not be null or undefined')
    }
  }

  _buildCharMap(iv, isEnc = false) {
    const sorted = this.domain
      .map(c => c)
      .sort((c1, c2) => this._enc(iv, c1).localeCompare(this._enc(iv, c2)))
    const table = {}
    for (let i = 0; i < this.domain.length; i++) {
      const char = this.domain[i]
      const encChar = sorted[i]
      table[isEnc ? char : encChar] = isEnc ? encChar : char
    }
    return table
  }

  _enc(iv, text) {
    const cipher = crypto.createCipheriv('aes-256-ctr', this.key, iv)
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
  }

  _validate(raw, enc) {
    if (raw.length + 1 !== enc.length) {
      throw new Error('some of the input characters are not in the cipher')
    }
  }
}

module.exports = FPE
