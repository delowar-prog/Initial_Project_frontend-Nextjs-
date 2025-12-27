"use client";

import React, { useEffect, useState } from 'react';
import { fetchRoles, deleteRole } from "src/services/roleServices";
import { fetchAllPermissions } from "src/services/permissionServices";
import IconButton from "src/app/(dashboard)/includes/iconBtn";
import IconComponent from "src/app/(dashboard)/includes/iconComponent";
import Swal from 'sweetalert2';
import { api } from 'src/lib/api';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: number[];
}

interface ApiRole {
  id: number;
  name: string;
  permissions: Permission[];
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

const RolePage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const [pagination, setPagination] = useState<ApiResponse | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateRoles = (roleData: ApiRole[]) => {
    // Transform permissions to array of ids
    const transformedRoles: Role[] = roleData.map(role => ({
      ...role,
      permissions: role.permissions.map(p => p.id)
    }));

    setRoles(transformedRoles);
  };

  /** --------------------------
  * Load roles from API
  * -------------------------- */
  useEffect(() => {
    const loadRoles = async () => {
      const res = await fetchRoles();
      const roleData: ApiRole[] = res.data;
      updateRoles(roleData);
    };

    loadRoles();
  }, [perPage]);

  /** --------------------------
  * Load permissions from API
  * -------------------------- */
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const permData = await fetchAllPermissions();
        setPermissions(permData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading permissions');
      }
    };

    loadPermissions();
  }, []);



  const handleAddRole = async () => {
    const newId = roles.length + 1;
    const role: Role = {
      id: newId,
      name: roleName,
      permissions: selectedPermissions,
    };
    try {
      const response = await api.post('/roles', role);
      setShowAddModal(false);
      setRoleName('');
      setSelectedPermissions([]);
      // Refresh the roles list
      const updatedResponse = await fetchRoles(pagination?.current_page || 1, perPage);
      updateRoles(updatedResponse.data);
      setPagination(updatedResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding role');
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setSelectedPermissions(role.permissions);
  };

  const handleUpdateRole = async () => {
    if (editingRole) {
      const updatedRole = {
        ...editingRole,
        name: roleName,
        permissions: selectedPermissions,
      };
      try {
        const response = await api.put(`/roles/${editingRole.id}`, updatedRole);
        setEditingRole(null);
        setRoleName('');
        setSelectedPermissions([]);
        // Refresh the roles list
        const updatedResponse = await fetchRoles(pagination?.current_page || 1, perPage);
        updateRoles(updatedResponse.data);
        setPagination(updatedResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while updating role');
      }
    }
  };

  const handleDeleteRole = async (id: number) => {
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
        await deleteRole(id);
        setRoles(roles.filter(r => r.id !== id));
        Swal.fire(
          'Deleted!',
          'The role has been deleted.',
          'success'
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while deleting role');
        Swal.fire(
          'Error!',
          'Failed to delete the role.',
          'error'
        );
      }
    }
  };

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions(prev =>
      prev.includes(permission.id)
        ? prev.filter(p => p !== permission.id)
        : [...prev, permission.id]
    );
  };

  // Only active permissions
  // const activePermissions = permissions.filter(p => p.active);

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Role Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Add Role
        </button>
      </div>

      {/* Role Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-slate-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Permissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{role.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-300">
                  {role.permissions.map(per => permissions.find(p => p.id === per)?.name).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <IconButton onClick={() => handleEditRole(role)} label="Edit">
                    <IconComponent name="edit" className="h-4 w-4 text-indigo-600" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteRole(role.id)} label="Delete">
                    <IconComponent name="delete" className="h-4 w-4 text-red-600" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingRole) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-black/70">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-slate-900 dark:border-slate-700">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-slate-100">
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Role Name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-700 mb-2 dark:text-slate-200">Select Permissions</h4>
                <div className="grid grid-cols-4 gap-4">
                  {permissions.map((permission) => (
                    <label key={permission.id} className="flex items-center dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.some(p => p === permission.id)}
                        onChange={() => togglePermission(permission)}
                        className="mr-2"
                      />
                      {permission.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center px-4 py-3 space-x-4">
                <button
                  onClick={() => {
                    if (editingRole) {
                      handleUpdateRole();
                    } else {
                      handleAddRole();
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {editingRole ? 'Update' : 'Create Role'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRole(null);
                    setRoleName('');
                    setSelectedPermissions([]);
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

export default RolePage;
