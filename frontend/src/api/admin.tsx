export async function getAllEmployees(token: string) {
    const url = "http://localhost:5167/api/admin/employees";
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // pass the auth token
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const employees = await response.json();
        console.log(employees);
        return employees;
    }
    catch (error: any) {
        console.error(error.message);
    }
}

export async function deleteEmployee(id: number, token: string) {
    const url = `http://localhost:5167/api/admin/employees/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        console.log(`Employee ${id} deleted`);
        return true;
    }
    catch (error: any) {
        console.error(error.message);
        return false;
    }
}
