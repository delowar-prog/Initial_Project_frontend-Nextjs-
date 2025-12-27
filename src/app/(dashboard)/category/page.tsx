"use client";

import React, { useEffect, useState } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "src/services/categoryServices";
import IconButton from "src/app/(dashboard)/includes/iconBtn";
import IconComponent from "src/app/(dashboard)/includes/iconComponent";
import Swal from 'sweetalert2';
import { useAuth } from 'src/context/authContext';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface ApiResponse {
  current_page: number;
  data: Category[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const CategoryPage: React.FC = () => {
  const { can } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [pagination, setPagination] = useState<ApiResponse | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const res = await fetchCategories();
        setCategories(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      await createCategory({ name: categoryName, description: categoryDescription });
      setShowAddModal(false);
      setCategoryName('');
      setCategoryDescription('');
      // Refresh the categories list
      const updatedResponse = await fetchCategories();
      setCategories(updatedResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding category');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
  };

  const handleUpdateCategory = async () => {
    if (editingCategory) {
      try {
        await updateCategory(editingCategory.id, { name: categoryName, description: categoryDescription });
        setEditingCategory(null);
        setCategoryName('');
        setCategoryDescription('');
        // Refresh the categories list
        const updatedResponse = await fetchCategories();
        setCategories(updatedResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while updating category');
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
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
        await deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
        Swal.fire(
          'Deleted!',
          'The category has been deleted.',
          'success'
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while deleting category');
        Swal.fire(
          'Error!',
          'Failed to delete the category.',
          'error'
        );
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Category Management</h1>
        {can("category.create") && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Add Category
          </button>
        )}
      </div>
      {/* Category Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-slate-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-300">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <IconButton onClick={() => handleEditCategory(category)} label="Edit">
                    <IconComponent name="edit" className="h-4 w-4 text-indigo-600" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCategory(category.id)} label="Delete">
                    <IconComponent name="delete" className="h-4 w-4 text-red-600" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingCategory) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-black/70">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-slate-900 dark:border-slate-700">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-slate-100">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Category Description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center px-4 py-3 space-x-4">
                <button
                  onClick={() => {
                    if (editingCategory) {
                      handleUpdateCategory();
                    } else {
                      handleAddCategory();
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {editingCategory ? 'Update' : 'Create Category'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    setCategoryName('');
                    setCategoryDescription('');
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

export default CategoryPage;