


export const loginFetch = async(email:string, password:string) => {

    console.log(email, password);
    return await fetch('/login', {method: 'POST',headers:{'Content-Type': 'application/json'},body: JSON.stringify({email, password})})
}