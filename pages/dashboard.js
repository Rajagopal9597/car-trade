import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard({ listings, totalPages, currentPage }) {
  const [currentListings, setCurrentListings] = useState(listings);
  const [page, setPage] = useState(currentPage);
  const [statusFilter, setStatusFilter] = useState('');
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({ carModel: '', price: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const res = await fetch(`/api/listings?page=${page}&status=${statusFilter}`);
      const data = await res.json();
      setCurrentListings(data.listings);
    };
    fetchListings();
  }, [page, statusFilter]);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setMessage(data.message);
      router.replace(router.asPath); // Refresh data
    } catch (err) {
      setMessage('An error occurred');
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData({ carModel: listing.carModel, price: listing.price });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/listings/${editingListing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', ...formData }),
      });
      const data = await res.json();
      setMessage(data.message);
      setEditingListing(null);
      router.replace(router.asPath);
    } catch (err) {
      setMessage('An error occurred');
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(1); // Reset to first page when changing filter
  };

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-8">Admin Dashboard</h1>
        {message && (
          <p className="mb-6 text-sm text-green-400 bg-gray-800 p-3 rounded-md">
            {message}
          </p>
        )}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Filter by Status:
          </label>
          <div className="flex space-x-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusFilter(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  statusFilter === option.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Car Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price ($/day)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submitted By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {currentListings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{listing.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{listing.carModel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{listing.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{listing.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{listing.submittedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{listing.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                    <button
                      onClick={() => handleAction(listing.id, 'approve')}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                      disabled={listing.status === 'approved'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(listing.id, 'reject')}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                      disabled={listing.status === 'rejected'}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleEdit(listing)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-200">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        {editingListing && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">Edit Listing</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">Car Model</label>
                  <input
                    type="text"
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200">Price ($/day)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingListing(null)}
                    className="px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cookies = req.headers.cookie || '';
  console.log('Raw cookies:', cookies); // Debug
  const token = cookies
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('token='))
    ?.split('=')[1];

  console.log('Extracted token:', token); // Debug
  if (token !== 'mock-jwt-token-123456') {
    console.log('Token validation failed. Redirecting to login.'); // Debug
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const page = parseInt(context.query.page) || 1;
  const res = await fetch(`http://localhost:3000/api/listings?page=${page}`);
  const data = await res.json();

  return {
    props: {
      listings: data.listings,
      totalPages: data.totalPages,
      currentPage: page,
    },
  };
}