"use client";

import React, { useState, useEffect } from 'react';
import { permissions } from 'src/services/permissionServices';
import { api } from 'src/lib/api';
import IconButton from "src/app/(dashboard)/includes/iconBtn";
import IconComponent from "src/app/(dashboard)/includes/iconComponent";
import Swal from 'sweetalert2';

interface Permission {
  id: number;
  name: string;
  
  guard_name: string;
  created_at: string;
  updated_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface ApiResponse {
  current_page: number;
  data: Permission[];
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

const PermissionPage: React.FC = () => {
  const [permissionsData, setPermissionsData] = useState<Permission[]>([]);
  const [pagination, setPagination] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPermission, setNewPermission] = useState({ name: ''});
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  useEffect(() => {
    const fetchPermissions = async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);
        const response = await permissions(page, perPage);
        setPermissionsData(response.data);
        setPagination(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching permissions';
        console.error('Permission fetch error:', err);
        setError(`Backend connection failed: ${errorMessage}. Please ensure your Laravel API server is running on port 8000.`);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [perPage]);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await permissions(page, perPage);
      setPermissionsData(response.data);
      setPagination(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching permissions');
    } finally {
      setLoading(false);
    }
  };

  const handlePerPageChange = async (newPerPage: number) => {
    setPerPage(newPerPage);
    try {
      setLoading(true);
      setError(null);
      const response = await permissions(1, newPerPage);
      setPermissionsData(response.data);
      setPagination(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching permissions';
      console.error('Permission per page change error:', err);
      setError(`Backend connection failed: ${errorMessage}. Please ensure your Laravel API server is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermission = async () => {
    try {
      const response = await api.post('/permissions', newPermission);
      setShowAddModal(false);
      setNewPermission({ name: ''});
      // Refresh the permissions list
      const updatedResponse = await permissions(pagination?.current_page || 1, perPage);
      setPermissionsData(updatedResponse.data);
      setPagination(updatedResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding permission');
    }
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setNewPermission({ name: permission.name });
    setShowAddModal(true);
  };

  const handleDeletePermission = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/permissions/${id}`);
        Swal.fire(
          'Deleted!',
          'The permission has been deleted.',
          'success'
        );
        // Refresh the permissions list
        const updatedResponse = await permissions(pagination?.current_page || 1, perPage);
        setPermissionsData(updatedResponse.data);
        setPagination(updatedResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while deleting permission');
        Swal.fire(
          'Error!',
          'An error occurred while deleting the permission.',
          'error'
        );
      }
    }
  };

  const handleUpdatePermission = async () => {
    if (editingPermission) {
      try {
        await api.put(`/permissions/${editingPermission.id}`, newPermission);
        setShowAddModal(false);
        setEditingPermission(null);
        setNewPermission({ name: ''});
        // Refresh the permissions list
        const updatedResponse = await permissions(pagination?.current_page || 1, perPage);
        setPermissionsData(updatedResponse.data);
        setPagination(updatedResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while updating permission');
      }
    }
  };


  console.log(permissionsData)
  if (loading) return <div className="p-6 dark:text-slate-200">Loading permissions...</div>;
  if (error) return <div className="p-6 text-red-600 dark:text-red-400">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-slate-900 dark:text-slate-100">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Permission Management</h1>
        <div className="flex items-center space-x-4">
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
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Add Permission
          </button>
        </div>
      </div>

      {/* Permission Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-t-lg dark:bg-slate-900 dark:border-slate-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Guard Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Updated At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
            {permissionsData.map((permission) => (
              <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{permission.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{permission.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{permission.guard_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{new Date(permission.created_at).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{new Date(permission.updated_at).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <IconButton onClick={() => handleEditPermission(permission)} label="Edit">
                    <IconComponent name="edit" className="h-4 w-4 text-indigo-600" />
                  </IconButton>
                  <IconButton onClick={() => handleDeletePermission(permission.id)} label="Delete">
                    <IconComponent name="delete" className="h-4 w-4 text-red-600" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4 px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg dark:bg-slate-800 dark:border-slate-700">
          <div className="text-sm text-gray-700 dark:text-slate-300">
            {pagination && (
              <>
                Showing {pagination.from} to {pagination.to} of {pagination.total} entries
              </>
            )}
          </div>
          <div className="flex justify-center space-x-2">
            {pagination && pagination.links.map((link, index) => (
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
      </div>
      
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-black/70">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-slate-100">
                {editingPermission ? 'Edit Permission' : 'Add New Permission'}
              </h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Permission Name"
                  value={newPermission.name}
                  onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center px-4 py-3 space-x-4">
                <button
                  onClick={() => {
                    if (editingPermission) {
                      handleUpdatePermission();
                    } else {
                      handleAddPermission();
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {editingPermission ? 'Update' : 'Create Permission'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPermission(null);
                    setNewPermission({ name: ''});
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 dark:bg-slate-700 dark:hover:bg-slate-600"
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

export default PermissionPage;
