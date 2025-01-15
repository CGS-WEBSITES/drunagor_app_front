import { decodeJwt } from 'jose';
import { useRouter } from "vue-router";


export function setToken(Token: string) {
    localStorage.setItem("accessToken", Token);
}

export function getToken() {

    const router = useRouter();

    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        const { exp: expiration } = decodeJwt(accessToken);
        const isExpired = !!expiration && Date.now() > expiration * 1000;

        if (!isExpired) {
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        }

        else {
            localStorage.removeItem('accessToken')
        }
    }

    // router.push("/login")
    return null;
}

export function isSignedIn() {
    const accessToken = getToken()

    if (!accessToken) {
        return false;
    }
    else {
        return true;
    }
}
