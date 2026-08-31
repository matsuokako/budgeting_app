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
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )
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

  // 選択した月の支出を取り出す
  const filteredExpenses = expenses.filter(
    (expense) => expense.date.slice(0, 7) === selectedMonth
  )

  // 合計
  const total = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )

  return (
    <div className="app">

      <header className="header">
      <h1>家計簿</h1>
      <br></br>
      </header>

      <h2>表示する月</h2><br/>
      <p>表示する月を選択してください。</p>

      <input
        type='month'
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      /><br/>

      <main className='container'>
      <br/><br/>
      <h2>今月の支出</h2>
      <p>¥{total}</p>
      <br/><br/>

      <div>
      <p>年月日と金額、ジャンルを選択して支出を追加してください。</p>
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

      <br/>
      <h2>支出一覧</h2>

      <ul>
        {filteredExpenses.map((expense, index) => (
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