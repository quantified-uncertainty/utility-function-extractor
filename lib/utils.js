import crypto from "crypto"

export const hashString = (string) => crypto.createHash('md5').update(string).digest('hex');