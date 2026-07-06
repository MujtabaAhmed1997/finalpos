export function formatDateForInput(dateValue) {
  if (!dateValue) return '';
  return String(dateValue).split('T')[0];
}

export async function fetchAllCustomers(get) {
  const res = await get('/customers?limit=10000&page=1');
  return res.data?.data || (Array.isArray(res.data) ? res.data : []);
}

export async function fetchAllSuppliers(get) {
  const res = await get('/suppliers?page=1&pageSize=10000');
  return res.data?.suppliers || res.data?.data || (Array.isArray(res.data) ? res.data : []);
}
