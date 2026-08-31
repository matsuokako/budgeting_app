import { useState } from 'react'

type Expense = {
  amount: number
  category: string
}

function App() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('食費')
  const [expenses, setExpenses] = useState<Expense[]>([])

  const addExpense = () => {
    if (amount === '') {
      return
    }

    const newExpense: Expense = {
      amount: Number(amount),
      category: category,
    }

    setExpenses([...expenses, newExpense])
    setAmount('')
  }

  const total = expenses.reduce(
    (sum, expenses) => sum + expenses.amount,
    0
  )

  return (
    <div>
      <h1>家計簿</h1><br></br>

      <h2>今月の支出</h2>
      <p>¥{total}</p>

      <div>
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
            {expense.category}:￥{expense.amount}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App