export default async function authRegister(name: string, email: string, password: string) {
    const url = "http://localhost:5252/auth/register"
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({Name: name, Email: email, Password: password}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return await response.json();
    }
    catch (error : any){
        console.error(error.message);
    }
}