import { useState } from 'react'
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, } from 'recharts'

// 支出用データ定義
type Expense = {
  amount: number
  category: string
  date: string
}

// 収入用データ定義
type Income = {
  amount: number
  source: string
  date: string
}

function App() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('食費')
  const [date, setDate] = useState('')

  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeSource, setIncomeSource] = useState('給与')
  const [incomeDate, setIncomeDate] = useState('')

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])

  // 支出編集機能用
  const [editingExpenseIndex, setEditingExpenseIndex] = useState<number | null>(null)

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

    // 編集機能対応
    if (editingExpenseIndex != null) {
      const newExpenses = [...expenses]
      newExpenses[editingExpenseIndex] = newExpense
      setExpenses(newExpenses)
      setEditingExpenseIndex(null)
    } else {
      setExpenses([...expenses, newExpense])
    }
    setAmount('')
    setDate('')
  }

  // 収入追加機能
  const addIncome = () => {
    if (incomeAmount === '' || incomeDate === '') {
      return
    }

    const newIncome: Income = {
      amount: Number(incomeAmount),
      source: incomeSource,
      date: incomeDate,
    }

    setIncomes([...incomes, newIncome])
    setIncomeAmount('')
    setIncomeDate('')
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

  // カテゴリー別合計
  const categoryTotals = filteredExpenses.reduce(
    (totals, expense) => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount

      return totals
    },
    {} as { [key: string]: number }
  )

  // 円グラフ用
  const chartData = Object.entries(categoryTotals).map(
    ([category, amount], index) => ({
      name: category,
      value: amount,
      fill: [
        '#8884d8',
        '#82ca9d',
        '#ffc658',
        '#ff8042',
        '#d26466',
      ][index],
    })
  )

  // 残高
  //const balance = incomeTotal - total

  return (
    <div className="app">

      <header className="header">
      <h1>家計簿App_test</h1>
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

      <h2>収入を追加</h2>

      <div>
        <p>年月日と金額、ジャンルを選択して収入を追加してください。</p>
        <input
          type="date"
          value={incomeDate}
          onChange={(e) => setIncomeDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="金額を入力"
          value={incomeAmount}
          onChange={(e) => setIncomeAmount(e.target.value)}
        />
        <select
          value={incomeSource}
          onChange={(e) => setIncomeSource(e.target.value)}
        >
          <option value={"給与"}>給与</option>
          <option value={"賞与"}>賞与</option>
          <option value={"臨時収入"}>臨時収入</option>
          <option value={"事業所得"}>事業所得</option>
          <option value={"その他"}>その他</option>
        </select>

        <button onClick={addIncome}>
          追加
        </button>
      </div>

      <h2>収入一覧</h2>
      <ul>
        {incomes.map((income, index) => (
          <li key={index}>
            {income.date} {income.source}:￥{income.amount}
          </li>
        ))}
      </ul>

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
        <option value="通信費">通信費</option>
        <option value="医療・保険費">医療・保険費</option>
        <option value="水道・光熱費">水道・光熱費</option>
        <option value="住まい">住まい</option>
        <option value="その他">その他</option>
      </select>

      <button onClick={addExpense}>
        支出を追加
      </button>
      </div><br/>

      <h2>ジャンル別支出一覧</h2>
      <ul>
        {Object.entries(categoryTotals).map(
          ([category, amount]) => (
            <li key={category}>
              {category}:￥{amount}
            </li>
          )
        )}
      </ul>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <br/>
      <h2>支出一覧</h2>

      <ul>
        {filteredExpenses.map((expense, index) => (
          <li key={index}>
            {expense.date} {expense.category}:￥{expense.amount}

            <button
              onClick={() => {
                setAmount(String(expense.amount))
                setCategory(expense.category)
                setDate(expense.date)
                setEditingExpenseIndex(index)
              }}
            >
              編集
            </button>

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