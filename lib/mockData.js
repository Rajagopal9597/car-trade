export let listings = [
  {
    id: 1,
    carModel: 'Toyota Camry',
    price: 50,
    status: 'pending',
    submittedBy: 'user1@example.com',
    createdAt: '2025-07-01',
  },
  {
    id: 2,
    carModel: 'Honda Civic',
    price: 45,
    status: 'pending',
    submittedBy: 'user2@example.com',
    createdAt: '2025-07-02',
  },
  {
    id: 3,
    carModel: 'Ford Mustang',
    price: 80,
    status: 'approved',
    submittedBy: 'user3@example.com',
    createdAt: '2025-07-03',
  },
  // Add more mock listings as needed
];

// In-memory audit trail
export let auditTrail = [];

export function updateListing(id, updates) {
  listings = listings.map((listing) =>
    listing.id === id ? { ...listing, ...updates } : listing
  );
}

export function addAuditLog(action, listingId, adminEmail) {
  auditTrail.push({
    id: auditTrail.length + 1,
    action,
    listingId,
    adminEmail,
    timestamp: new Date().toISOString(),
  });
}