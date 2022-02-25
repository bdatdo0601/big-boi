const nacl = require('tweetnacl');

// Your public key can be found on your application in the Developer Portal
const DISCORD_APPLICATION_PUBLIC_KEY = process.env.DISCORD_APPLICATION_PUBLIC_KEY;

const isDiscordVerified = (evt) => {
    try {
        const signature = get(evt, "headers.x-signature-ed25519", "");
        const timestamp = get(evt, "headers.x-signature-timestamp", "");
        const rawBody = get(evt, "body"); // rawBody is expected to be a string, not raw bytes
        return nacl.sign.detached.verify(
            Buffer.from(timestamp + rawBody),
            Buffer.from(signature, 'hex'),
            Buffer.from(DISCORD_APPLICATION_PUBLIC_KEY, 'hex')
        );
    } catch (err) {
        console.warn("verification failed: ", err);
        return false;
    }
} 

module.exports = { isDiscordVerified };
