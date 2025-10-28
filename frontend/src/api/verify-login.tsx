export default async function verifyData(username: string, password: string): Promise<JSON | undefined> {
    const url = "http://localhost:5283/auth/login"
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ username, password}),
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