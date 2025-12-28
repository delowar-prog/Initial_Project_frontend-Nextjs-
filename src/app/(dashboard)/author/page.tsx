"use client";

import React, { useEffect, useMemo, useState } from 'react';
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

interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface ApiResponse {
  current_page: number;
  data: Author[];
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

const AuthorPage: React.FC = () => {
  const {can, canAny} = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [pagination, setPagination] = useState<ApiResponse | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeResponse = (response: ApiResponse | Author[]) => {
    if (Array.isArray(response)) {
      return { items: response, page: null as ApiResponse | null };
    }
    return { items: response?.data ?? [], page: response ?? null };
  };

  const applyResponse = (response: ApiResponse | Author[], fallbackPage: number) => {
    const normalized = normalizeResponse(response);
    setAuthors(normalized.items);
    setPagination(normalized.page);
    setCurrentPage(normalized.page?.current_page ?? fallbackPage);
  };

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAuthors(1, perPage);
        applyResponse(response, 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading authors');
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, [perPage]);

  const handlePageChange = async (page: number) => {
    if (!pagination) {
      setCurrentPage(page);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAuthors(page, perPage);
      applyResponse(response, page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading authors');
    } finally {
      setLoading(false);
    }
  };

  const handlePerPageChange = async (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAuthors(1, newPerPage);
      applyResponse(response, 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading authors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuthor = async () => {
    try {
      await createAuthor({ name: authorName, bio: authorBio });
      setShowAddModal(false);
      setAuthorName('');
      setAuthorBio('');
      // Refresh the authors list
      const targetPage = pagination?.current_page ?? currentPage ?? 1;
      const updatedResponse = await fetchAuthors(targetPage, perPage);
      applyResponse(updatedResponse, targetPage);
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
        const targetPage = pagination?.current_page ?? currentPage ?? 1;
        const updatedResponse = await fetchAuthors(targetPage, perPage);
        applyResponse(updatedResponse, targetPage);
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
        const targetPage = pagination?.current_page ?? currentPage ?? 1;
        const updatedResponse = await fetchAuthors(targetPage, perPage);
        applyResponse(updatedResponse, targetPage);
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

  const filteredAuthors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return authors;
    return authors.filter((author) => {
      const name = author.name?.toLowerCase() ?? "";
      const bio = author.bio?.toLowerCase() ?? "";
      return name.includes(query) || bio.includes(query);
    });
  }, [authors, searchTerm]);

  const hasServerPagination = Boolean(pagination && pagination.links?.length);
  const clientTotalPages = useMemo(() => {
    return Math.ceil(filteredAuthors.length / perPage);
  }, [filteredAuthors.length, perPage]);
  const totalPages = hasServerPagination ? (pagination?.last_page ?? 0) : clientTotalPages;
  const activePage = hasServerPagination ? (pagination?.current_page ?? currentPage) : currentPage;

  useEffect(() => {
    if (hasServerPagination) return;
    if (searchTerm.trim()) {
      setCurrentPage(1);
    }
  }, [hasServerPagination, searchTerm]);

  useEffect(() => {
    if (hasServerPagination) return;
    if (clientTotalPages > 0 && currentPage > clientTotalPages) {
      setCurrentPage(clientTotalPages);
    }
  }, [hasServerPagination, clientTotalPages, currentPage]);

  const displayedAuthors = useMemo(() => {
    if (hasServerPagination) return filteredAuthors;
    const start = (currentPage - 1) * perPage;
    return filteredAuthors.slice(start, start + perPage);
  }, [filteredAuthors, hasServerPagination, currentPage, perPage]);

  const paginationLinks = useMemo(() => {
    if (totalPages <= 1) return [];
    const pages = new Set<number>();
    const addRange = (start: number, end: number) => {
      for (let i = start; i <= end; i += 1) {
        if (i >= 1 && i <= totalPages) pages.add(i);
      }
    };
    addRange(1, 3);
    addRange(totalPages - 2, totalPages);
    addRange(activePage - 1, activePage + 1);
    const sorted = Array.from(pages).sort((a, b) => a - b);
    const items: Array<{
      type: "page" | "ellipsis" | "prev" | "next";
      label: string;
      page: number | null;
      active?: boolean;
      disabled?: boolean;
    }> = [];
    items.push({
      type: "prev",
      label: "Previous",
      page: activePage > 1 ? activePage - 1 : null,
      disabled: activePage <= 1,
    });
    let last = 0;
    for (const page of sorted) {
      if (last && page - last > 1) {
        items.push({ type: "ellipsis", label: "...", page: null });
      }
      items.push({
        type: "page",
        label: String(page),
        page,
        active: page === activePage,
      });
      last = page;
    }
    items.push({
      type: "next",
      label: "Next",
      page: activePage < totalPages ? activePage + 1 : null,
      disabled: activePage >= totalPages,
    });
    return items;
  }, [totalPages, activePage]);

  const shouldShowPagination = totalPages > 1;

  if (loading) {
    return <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-red-500 dark:border-slate-700 dark:bg-slate-900">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="mb-6">
        <div className="flex justify-between items-center">
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
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, bio"
              aria-label="Search authors"
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

      {/* Author Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-t-lg dark:bg-slate-900 dark:border-slate-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Bio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
            {displayedAuthors.map((author) => (
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
            {displayedAuthors.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-center text-sm text-gray-500 dark:text-slate-300">
                  No authors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {shouldShowPagination && (
        <div className="flex justify-between items-center mt-4 px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg dark:bg-slate-800 dark:border-slate-700">
          <div className="text-sm text-gray-700 dark:text-slate-300">
            {searchTerm.trim()
              ? <>Showing {displayedAuthors.length} results on this page</>
              : <>
                  Showing {hasServerPagination ? pagination?.from ?? 0 : (filteredAuthors.length ? (activePage - 1) * perPage + 1 : 0)}
                  {" "}to{" "}
                  {hasServerPagination ? pagination?.to ?? 0 : Math.min(activePage * perPage, filteredAuthors.length)}
                  {" "}of{" "}
                  {hasServerPagination ? pagination?.total ?? 0 : filteredAuthors.length}
                  {" "}entries
                </>
            }
          </div>
          <div className="flex justify-center space-x-2">
            {paginationLinks.map((link, index) => (
              link.type === "ellipsis" ? (
                <span key={`ellipsis-${index}`} className="px-2 py-2 text-sm text-gray-500 dark:text-slate-400">
                  {link.label}
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => link.page && handlePageChange(link.page)}
                  disabled={link.page === null || link.active || link.disabled}
                  className={`px-3 py-2 text-sm font-medium rounded ${link.active
                      ? 'bg-blue-500 text-white dark:bg-blue-500'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                    } ${(link.page === null || link.disabled) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  {link.label}
                </button>
              )
            ))}
          </div>
        </div>
      )}

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
