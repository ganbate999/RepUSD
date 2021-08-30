/**** add token into header url */
export function makeTokenHeader(token) {
    const headerConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    return headerConfig;
}