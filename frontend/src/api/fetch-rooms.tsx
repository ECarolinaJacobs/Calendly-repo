export default async function FetchRooms(): Promise<JSON | undefined> {
    const url = "http://localhost:5167/api/rooms"
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;
    }
    catch (error : any){
        console.error(error.message);
    }
}