import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import TransactionForm from './components/TransactionForm'
import Filters from './components/Filters'
import TransactionTable from './components/TransactionTable'

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Dashboard />
        <TransactionForm />
        <Filters />
        <TransactionTable />
      </main>
    </div>
  )
}

export default App