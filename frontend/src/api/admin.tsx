import apiClient from "./apiClient";
import type { Employee } from "../models/Employee";

export async function getAllEmployees(): Promise<Employee[]> {
  try {
    const response = await apiClient.get<Employee[]>("/admin/employees");
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to get employees:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function deleteEmployee(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/admin/employees/${id}`);
    return true;
  } catch (error: any) {
    console.error(
      `Failed to delete employee ${id}:`,
      error.response?.data || error.message
    );
    return false;
  }
}
