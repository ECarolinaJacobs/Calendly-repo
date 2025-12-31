//elena
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

export async function searchEmployees(searchTerm: string): Promise<Employee[]> {
  try {
    const response = await apiClient.get<Employee[]>("/admin/employees/search", {
      params: { searchTerm } // query param
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to find employees",
      error.response?.data || error.message
    );
    throw error;
  }
}

// interface to get statistics 
export interface AdminStats {
  totalEmployees: number;
  totalAdmins: number;
  totalRegularUsers: number;
  totalCoins: number;
  averageCoinsPerUser: number;
}

export async function getStatistics(): Promise<AdminStats> {
  try {
    const response = await apiClient.get<AdminStats>("/admin/statistics");
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to get statistics:",
      error.response?.data || error.message
    );
    throw error;
  }
}