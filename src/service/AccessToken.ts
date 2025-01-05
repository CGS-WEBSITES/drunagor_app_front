import { decodeJwt } from 'jose';
import { useRouter } from "vue-router";

const router = useRouter();

export function setToken(Token: string) {
    localStorage.setItem("accessToken", Token);
}

export function getToken() {

    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        const { exp: expiration } = decodeJwt(accessToken);
        console.log(expiration);
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

    router.push({ name: 'Login' })
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
