export default function TransactionTable({ 
  transactions = [], // GÜNCELLEME BURADA: Eğer veri gelmezse çökmemesi için varsayılan olarak boş dizi [] atadık.
  handleDelete,
  currentPage,
  totalPages,
  setCurrentPage,
  isLoading
}) {
  
  return (
    <div>
      <h3>Transaction History</h3>
      
      {/* Scrollable container for the table */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          
          {/* Sticky header to keep column names visible while scrolling */}
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9f9f9' }}>
            <tr>
              <th style={{ padding: '8px' }}>Description</th>
              <th style={{ padding: '8px' }}>Amount</th>
              <th style={{ padding: '8px' }}>Date</th>
              <th style={{ padding: '8px' }}>Action</th>
            </tr>
          </thead>
          
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '8px', textAlign: 'center' }}>
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              // Map through the transactions passed from the Dashboard component
              transactions.map((t) => (
                <tr key={t._id}>
                  <td style={{ padding: '8px' }}>
                    {t.description || 'No Description'}
                  </td>
                  
                  {/* Dynamically style the amount: red for expenses, green for income */}
                  <td style={{ padding: '8px', color: t.type === 'expense' ? 'red' : 'green', fontWeight: 'bold' }}>
                    {t.type === 'expense' ? '-' : '+'}₺{t.amount}
                  </td>
                  
                  <td style={{ padding: '8px' }}>
                    {new Date(t.date || t.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  
                  <td style={{ padding: '8px' }}>
                    <button 
                      onClick={() => handleDelete(t._id)}
                      style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
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

      {/* PAGINATION CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
        
        {/* Previous Page Button */}
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1 || isLoading}
          style={{ padding: '5px 15px', cursor: (currentPage === 1 || isLoading) ? 'not-allowed' : 'pointer', opacity: (currentPage === 1 || isLoading) ? 0.5 : 1 }}
        >
          &larr; Previous
        </button>
        
        {/* Current Page Indicator */}
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Page {currentPage} / {totalPages}
        </span>
        
        {/* Next Page Button */}
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages || isLoading}
          style={{ padding: '5px 15px', cursor: (currentPage === totalPages || isLoading) ? 'not-allowed' : 'pointer', opacity: (currentPage === totalPages || isLoading) ? 0.5 : 1 }}
        >
          Next &rarr;
        </button>

      </div>
    </div>
  );
}