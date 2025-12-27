"use client";

import React, { useEffect, useState } from 'react';
import { fetchAuthors, createAuthor, updateAuthor, deleteAuthor } from "src/services/authorServices";
import IconButton from "src/app/(dashboard)/includes/iconBtn";
import IconComponent from "src/app/(dashboard)/includes/iconComponent";
import Swal from 'sweetalert2';
import { useAuth } from 'src/context/authContext';

interface Author {
  id: number;
  name: string;
  bio: string;
}

interface ApiResponse {
  current_page: number;
  data: Author[];
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

const AuthorPage: React.FC = () => {
  const {can, canAny} = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [pagination, setPagination] = useState<ApiResponse | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        setLoading(true);
        const res = await fetchAuthors();
        setAuthors(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading authors');
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, []);

  const handleAddAuthor = async () => {
    try {
      await createAuthor({ name: authorName, bio: authorBio });
      setShowAddModal(false);
      setAuthorName('');
      setAuthorBio('');
      // Refresh the authors list
      const updatedResponse = await fetchAuthors();
      setAuthors(updatedResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding author');
    }
  };

  const handleEditAuthor = (author: Author) => {
    setEditingAuthor(author);
    setAuthorName(author.name);
    setAuthorBio(author.bio);
  };

  const handleUpdateAuthor = async () => {
    if (editingAuthor) {
      try {
        await updateAuthor(editingAuthor.id, { name: authorName, bio: authorBio });
        setEditingAuthor(null);
        setAuthorName('');
        setAuthorBio('');
        // Refresh the authors list
        const updatedResponse = await fetchAuthors();
        setAuthors(updatedResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while updating author');
      }
    }
  };

  const handleDeleteAuthor = async (id: number) => {
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
        await deleteAuthor(id);
        setAuthors(authors.filter(a => a.id !== id));
        Swal.fire(
          'Deleted!',
          'The author has been deleted.',
          'success'
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while deleting author');
        Swal.fire(
          'Error!',
          'Failed to delete the author.',
          'error'
        );
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Author Management</h1>
        {can("create-authors") && (
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Add Author
        </button>
        )}
      </div>

      {/* Author Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-slate-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Bio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
            {authors.map((author) => (
              <tr key={author.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{author.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-300">{author.bio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <IconButton onClick={() => handleEditAuthor(author)} label="Edit">
                    <IconComponent name="edit" className="h-4 w-4 text-indigo-600" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteAuthor(author.id)} label="Delete">
                    <IconComponent name="delete" className="h-4 w-4 text-red-600" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingAuthor) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-black/70">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-slate-900 dark:border-slate-700">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-slate-100">
                {editingAuthor ? 'Edit Author' : 'Add New Author'}
              </h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Author Name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Author Bio"
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center px-4 py-3 space-x-4">
                <button
                  onClick={() => {
                    if (editingAuthor) {
                      handleUpdateAuthor();
                    } else {
                      handleAddAuthor();
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {editingAuthor ? 'Update' : 'Create Author'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAuthor(null);
                    setAuthorName('');
                    setAuthorBio('');
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

export default AuthorPage;