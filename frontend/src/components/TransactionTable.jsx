import { useState, useEffect } from 'react';

export default function TransactionTable({ refreshTrigger, onDataChanged, filterCategory, filterDate }) {
  
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. FETCH DATA (Runs on initial load and when refreshTrigger changes)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3000/transactions');
        if (!response.ok) throw new Error('Failed to fetch data.');
        const data = await response.json();
        setTransactions(data.data || data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions(); 
  }, [refreshTrigger]); 

  // 2. DELETE FUNCTION
  const handleDelete = async (id) => {
    // Show a native browser confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!isConfirmed) return; // Stop if the user clicks 'Cancel'

    try {
      // Send the DELETE request to our backend API
      const response = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the transaction.');
      }

      // If successful, notify App.jsx to refresh the table data
      if (onDataChanged) {
        onDataChanged();
      }

    } catch (err) {
      console.error('Delete error:', err);
      alert('Could not delete the item.');
    }
  };

  // 3. FRONTEND FILTERING LOGIC
  // We take the raw array from the backend and filter it using pure JavaScript.
  const filteredTransactions = transactions.filter((t) => {
    // Category check: If 'all', return true. Otherwise, check if it matches the selected category.
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    
    // Date check: If no date is selected, return true. 
    // Otherwise, check if the transaction date starts with the selected date (e.g., '2026-07-09').
    let matchesDate = true;
    if (filterDate) {
      // Convert backend date to YYYY-MM-DD format to compare with the HTML date input
      const itemDate = new Date(t.date || t.createdAt).toISOString().split('T')[0];
      matchesDate = itemDate === filterDate;
    }

    // An item must match BOTH conditions to be displayed
    return matchesCategory && matchesDate;
  });

  // RENDER UI
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h3>Transaction History</h3>
      
      {/* We use the same scrollable container trick from earlier */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9f9f9' }}>
            <tr>
              <th style={{ padding: '8px' }}>Description</th>
              <th style={{ padding: '8px' }}>Amount</th>
              <th style={{ padding: '8px' }}>Date</th>
              
            </tr>
          </thead>
          <tbody>
            
            {/* IMPORTANT: We map over 'filteredTransactions', not the raw 'transactions' */}
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '8px', textAlign: 'center' }}>
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t._id}>
                  <td style={{ padding: '8px' }}>
                    {t.description || 'No Description'}
                  </td>
                  
                  <td style={{ 
                    padding: '8px',
                    color: t.type === 'expense' ? 'red' : 'green',
                    fontWeight: 'bold'
                  }}>
                    {t.type === 'expense' ? '-' : '+'}₺{t.amount}
                  </td>
                  
                  <td style={{ padding: '8px' }}>
                    {new Date(t.date || t.createdAt).toLocaleDateString('tr-TR')}
                  </td>

                  <td style={{ padding: '8px' }}>
                    {/* The Delete Button */}
                    <button 
                      onClick={() => handleDelete(t._id)}
                      style={{ 
                        backgroundColor: '#ff4d4f', 
                        color: 'white', 
                        border: 'none', 
                        padding: '5px 10px', 
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}