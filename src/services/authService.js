import {jwtDecode} from 'jwt-decode';

export function getIdFromToken() {
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            const decoded = jwtDecode(token);
            return decoded.id;
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    } else {
        console.log('Token not found');
        return null;
    }
}
