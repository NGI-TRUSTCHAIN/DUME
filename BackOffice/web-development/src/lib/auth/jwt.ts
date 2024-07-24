import jwt, {JwtPayload} from "jsonwebtoken";

interface SignOption {
    expiresIn?: string | number;
}

const secretKey = process.env.JWT_SECRET_KEY || ''
const tokenDuration = process.env.TOKEN_DURATION || ''

const DEFAULT_SIGN_OPTION: SignOption = {
    expiresIn: tokenDuration,
};


export function signJwtAccessToken(payload: JwtPayload, options: SignOption = DEFAULT_SIGN_OPTION) {
    return jwt.sign(payload, secretKey, options);
}

export function verifyJwt(token: string) {
    try {
        return jwt.verify(token, secretKey) as JwtPayload;
    } catch (error) {
        return null
    }

}