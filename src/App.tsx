import { useState } from 'react'

type Expense = {
  amount: number
  category: string
  date: string
}

function App() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('食費')
  const [date, setDate] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])

  // 追加機能
  const addExpense = () => {
    if (amount === '' || date === '') {
      return
    }

    const newExpense: Expense = {
      amount: Number(amount),
      category: category,
      date: date,
    }

    setExpenses([...expenses, newExpense])
    setAmount('')
    setDate('')
  }

  // 削除機能
  const deleteExpense = (index: number) => {
    const newExpenses = expenses.filter((_, i) => i !== index)
    setExpenses(newExpenses)
  }

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )

  return (
    <div className="app">

      <header className="header">
      <h1>家計簿</h1>
      <br></br>
      </header>

      <main className='container'>
      <h2>今月の支出</h2>
      <p>¥{total}</p>

      <div>
      <input
        type='date'
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="number"
        placeholder="金額を入力"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="食費">食費</option>
        <option value="交通費">交通費</option>
        <option value="娯楽">娯楽</option>
        <option value="日用品">日用品</option>
        <option value="その他">その他</option>
      </select>

      <button onClick={addExpense}>
        支出を追加
      </button>
    </div>

      <h2>支出一覧</h2>

      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.date} {expense.category}:￥{expense.amount}

            <button onClick={() => deleteExpense(index)}>
              削除
            </button>
          </li>
        ))}
      </ul>
      </main>
    </div>
  )
}

export default App