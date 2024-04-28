function encrypt(plain, key) {
    plain = plain.toLowerCase();
    if(!plain.match(/[a-z\s]/)) {
        console.error('Message contains unsupported characters!');
    }

    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' '];
    const plainCharArray = plain.split('');

    const encryptedCharArray = plainCharArray.map((character) => {
        const position = (alphabet.indexOf(character) + key) % alphabet.length;
        return alphabet[position];
    });

    return encryptedCharArray.join('');
}

function decrypt(encrypted, key) {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' '];
    const encryptedCharArray = encrypted.split('');

    encrypted = encrypted.toLowerCase();
    if(!encrypted.match(/[a-z\s]/)) {
        console.error('Message contains unsupported characters!');
    }

    const decryptedCharArray = encryptedCharArray.map((character) => {
        const translatedKey = (2 * alphabet.length - key) % alphabet.length;
        return encrypt(character, translatedKey);
    });

    return decryptedCharArray.join('');
}

const encrypted = encrypt('hello', 20);
console.log(encrypted)
console.log(decrypt(encrypted, 20))