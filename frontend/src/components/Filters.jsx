export default function Filters({
  selectedCategory, setSelectedCategory,
  selectedDate, setSelectedDate
}) {
  return (
    <div style={{
      padding: '15px',
      border: '1px solid #ccc',
      marginBottom: '20px',
      display:'flex',
      gap: '20px',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px'
    }}>
      <h4 style={{ margin: 0 }}>Filters:</h4>
      
      {/* Category Dropdown Filter */}
      <div>
        <label style={{ marginRight: '10px' }}>Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="salary">Salary</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Date Picker Filter */}
      <div>
        <label style={{ marginRight: '10px' }}>Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        
        {/* Render a "Clear Date" button only if a date is currently selected */}
        {selectedDate && (
          <button
            onClick={() => setSelectedDate('')}
            style={{ marginLeft: '10px', cursor: 'pointer', padding: '2px 8px' }}
          >
            Clear Date
          </button>
        )}
      </div>
    </div>
  );
}