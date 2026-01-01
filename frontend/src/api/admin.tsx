//elena
import apiClient from "./apiClient";
import type { Employee } from "../models/Employee";

/**
 * fetches all employees from admin endpoint
 * @returns promise resolved to an array of employee objects
 * @throws error if api request fails
 */
export async function getAllEmployees(): Promise<Employee[]> {
  const response = await apiClient.get<Employee[]>("/admin/employees");
  return response.data;
}

/**
 * deletes employee by id
 * @param id 
 * @returns promise resolved to true on success
 * @throws error if deletion fails
 */
export async function deleteEmployee(id: number): Promise<void> {
  await apiClient.delete(`/admin/employees/${id}`);
}

/**
 * searches for employees by search term
 * @param searchTerm
 * @returns promise resolved to array for matching emp objects
 * @throws error if search fails
 */
export async function searchEmployees(searchTerm: string): Promise<Employee[]> {
  const response = await apiClient.get<Employee[]>("/admin/employees/search", {
    params: {searchTerm}
  });
  return response.data;
}

// interface to get statistics 
export interface AdminStats {
  totalEmployees: number;
  totalAdmins: number;
  totalRegularUsers: number;
  totalCoins: number;
  averageCoinsPerUser: number;
}

/**
 * fetches admin statistics
 * @returns promise resolved to adminstats object
 * @throws error if the request fails
 */
export async function getStatistics(): Promise<AdminStats> {
  const response = await apiClient.get<AdminStats>("/admin/statistics");
  return response.data;
}