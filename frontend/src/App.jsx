import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import Filters from './components/Filters';
import TransactionTable from './components/TransactionTable';

function App() {
  // Trigger to refresh the table when a new item is added or deleted
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // GLOBAL FILTER STATES
  // We keep them here in App.jsx so we can pass them down to both Filters and TransactionTable
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  // Function to force a table refresh
 

  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <Dashboard />
        
        {/* Pass the data change handler to the Form */}
        
        
    
        
        
      </main>
    </div>
  );
}

export default App;