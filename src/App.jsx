import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import './App.css'

//Colors for pie chart
const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140']

function App() {
  // State for storing all transactions
  const [transactions, setTransactions] = useState([])

  // Form input states
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense') // default to expense
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // today's date

  // Category options
  const incomeCategories = [
    'Client Payment',
    'Project Fee',
    'Consultation',
    'Other Income'
  ]

  const expenseCategories = [
    'Software/Tools',
    'Equipment',
    'Marketing',
    'Travel',
    'Office Supplies',
    'Professional Development',
    'Other Expense'
  ]

  // Get current categories based on selected type
  const currentCategories = type === 'income' ? incomeCategories : expenseCategories

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalIncome - totalExpenses

  // Handle adding a new transaction
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!description.trim() || !amount || !category) {
      alert('Please fill in all fields')
      return
    }

    // Create new transaction
    const newTransaction = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      type: type,
      category: category,
      date: date
    }

    // Add to transactions array
    setTransactions([newTransaction, ...transactions])

    // Reset form
    setDescription('')
    setAmount('')
    setCategory('')
    setDate(new Date().toISOString().split('T')[0])
  }

  // Handle deleting a transaction
  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

    // Prepare data for pie chart - expenses grouped by category
  const getExpensesByCategory = () => {
    const expenses = transactions.filter(t => t.type === 'expense')
    
    // Group expenses by category
    const categoryTotals = {}
    expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount
      } else {
        categoryTotals[expense.category] = expense.amount
      }
    })

    // Convert to array format for Recharts
    return Object.keys(categoryTotals).map(category => ({
      name: category,
      value: categoryTotals[category]
    }))
  }

  const expenseData = getExpensesByCategory()

  return (
    <div className="app">
      <header className="header">
        <h1>💰 Expense Tracker</h1>
        <p>Track your income and expenses with ease</p>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income-card">
          <h3>Total Income</h3>
          <p className="amount">${totalIncome.toFixed(2)}</p>
        </div>

        <div className="summary-card expense-card">
          <h3>Total Expenses</h3>
          <p className="amount">${totalExpenses.toFixed(2)}</p>
        </div>

        <div className="summary-card balance-card">
          <h3>Net Balance</h3>
          <p className="amount">${netBalance.toFixed(2)}</p>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="form-container">
        <h2>Add Transaction</h2>
        <form onSubmit={handleSubmit} className="transaction-form">
          
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="e.g., Client payment for website"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="income"
                  checked={type === 'income'}
                  onChange={(e) => {
                    setType(e.target.value)
                    setCategory('') // reset category when type changes
                  }}
                />
                <span className="radio-text income-text">Income</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={(e) => {
                    setType(e.target.value)
                    setCategory('') // reset category when type changes
                  }}
                />
                <span className="radio-text expense-text">Expense</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {currentCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Add Transaction
          </button>
        </form>
      </div>

      {/* Transactions List */}
      <div className="transactions-container">
        <h2>Transaction History</h2>
        
        {transactions.length === 0 ? (
          <p className="no-transactions">No transactions yet. Add your first transaction above!</p>
        ) : (
          <div className="transactions-list">
            {transactions.map(transaction => (
              <div 
                key={transaction.id} 
                className={`transaction-item ${transaction.type}`}
              >
                <div className="transaction-icon">
                  {transaction.type === 'income' ? '📈' : '📉'}
                </div>
                
                <div className="transaction-details">
                  <div className="transaction-description">
                    {transaction.description}
                  </div>
                  <div className="transaction-meta">
                    <span className="transaction-category">{transaction.category}</span>
                    <span className="transaction-date">{transaction.date}</span>
                  </div>
                </div>

                <div className="transaction-amount">
                  ${transaction.amount.toFixed(2)}
                </div>

                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(transaction.id)}
                  title="Delete transaction"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expense Breakdown Chart */}
      {expenseData.length > 0 && (
        <div className="chart-container">
          <h2>Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default App