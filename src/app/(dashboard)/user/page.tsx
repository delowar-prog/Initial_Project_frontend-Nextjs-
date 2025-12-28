"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { fetchUsers, assignRole } from "src/services/userServices";
import { fetchRoles } from "src/services/roleServices";
import IconButton from "src/app/(dashboard)/includes/iconBtn";
import IconComponent from "src/app/(dashboard)/includes/iconComponent";

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: any[]; // Assuming permissions array, adjust if needed
}

interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface ApiResponse {
  current_page: number;
  data: User[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showAssignModal, setShowAssignModal] = useState(false);

  /** --------------------------
   * Load users from API
   * -------------------------- */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchUsers(1, perPage);
        setUsers(response.data);
        setPagination(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [perPage]);

  /** --------------------------
   * Load roles for assignment
   * -------------------------- */
  const loadRoles = async () => {
    try {
      const response = await fetchRoles(1, 100); // Large per_page to get all roles
      setRoles(response.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetchUsers(page, perPage);
      setUsers(response.data);
      setPagination(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handlePerPageChange = async (newPerPage: number) => {
    setPerPage(newPerPage);
    try {
      setLoading(true);
      const response = await fetchUsers(1, newPerPage);
      setUsers(response.data);
      setPagination(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = (user: User) => {
    setSelectedUser(user);
    setSelectedRole("");
    setShowAssignModal(true);
  };

  const handleAssignRoleSubmit = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      await assignRole(selectedUser.id, selectedRole);
      setShowAssignModal(false);
      // Reload users to reflect changes
      const response = await fetchUsers(pagination?.current_page || 1, perPage);
      setUsers(response.data);
      setPagination(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while assigning role');
    }
  };

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const name = user.name?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";
      const phone = user.phone?.toLowerCase() ?? "";
      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  }, [users, searchTerm]);

  if (loading) {
    return <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-red-500 dark:border-slate-700 dark:bg-slate-900">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">User Management</h1>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email, phone"
              aria-label="Search users"
              className="w-64 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="per-page" className="text-sm text-gray-700 mr-2 dark:text-slate-300">Show:</label>
            <select
              id="per-page"
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
            <label className="text-sm text-gray-700 ml-1 dark:text-slate-300">entries</label>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-t-lg dark:bg-slate-900 dark:border-slate-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Roles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{user.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-300">
                  {user.roles.map(role => role.name).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <IconButton onClick={() => {/* handle edit */}} label="Edit">
                    <IconComponent name="edit" className="h-4 w-4 text-indigo-600" />
                  </IconButton>
                  <IconButton onClick={() => {/* handle delete */}} label="Delete">
                    <IconComponent name="delete" className="h-4 w-4 text-red-600" />
                  </IconButton>
                  <IconButton onClick={() => handleAssignRole(user)} label="Assign Role">
                    <IconComponent name="user" className="h-4 w-4 text-green-600" />
                  </IconButton>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-500 dark:text-slate-300">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-4 px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg dark:bg-slate-800 dark:border-slate-700">
          <div className="text-sm text-gray-700 dark:text-slate-300">
            {searchTerm.trim()
              ? <>Showing {filteredUsers.length} results on this page</>
              : <>Showing {pagination.from} to {pagination.to} of {pagination.total} entries</>
            }
          </div>
          <div className="flex justify-center space-x-2">
            {pagination.links.map((link, index) => (
              <button
                key={index}
                onClick={() => link.page && handlePageChange(link.page)}
                disabled={link.page === null || link.active}
                className={`px-3 py-2 text-sm font-medium rounded ${link.active
                    ? 'bg-blue-500 text-white dark:bg-blue-500'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  } ${link.page === null ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full dark:bg-black/70" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-slate-900 dark:border-slate-700">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-100">Assign Role to {selectedUser?.name}</h3>
              <div className="mt-2 px-7 py-3">
                <select
                  value={selectedRole || ''}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleAssignRoleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  disabled={!selectedRole}
                >
                  Assign Role
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="mt-3 px-4 py-2 bg-gray-300 text-gray-900 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
