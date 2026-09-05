// memo:まだローカル環境でしか動作しません。localhost:xxxx
import { useState } from 'react'
import './App.css'
import { PieChart, Pie, ResponsiveContainer, } from 'recharts'
import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

// 支出用データ定義
type Expense = {
  id: number
  amount: number
  category: string
  date: string
}

// 収入用データ定義
type Income = {
  id: number
  amount: number
  source: string
  date: string
}

function App() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('食費')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)) // 初期値を今日日付とする

  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeSource, setIncomeSource] = useState('給与')
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().slice(0, 10))

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])

  // 支出編集機能用
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null)

  // 収入編集機能用
  // 初期値はnull
  // 収入編集用indexと、収入編集用の関数。useStateによって、numberかnull値が入る。
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null)
  
  // データベースから支出を取得し、expensesにセットする
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      setExpenses(data)

      console.log(data)
      console.log(error)
    }
    testConnection()
  }, [])

  // 追加機能
  // MOD 2026/09/03 データベース連携
  const addExpense = async () => {
    if (amount === '' || date === '') {
      return
    }

    /*
    const newExpense: Expense = {
      id: Date.now(),
      amount: Number(amount),
      category: category,
      date: date,
    }
    */

    const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        amount: Number(amount),
        category: category,
        date: date,
      },
    ])
    .select()

    if (error) {
      console.error(error)
      return
    }

    console.log(data)

    /*
    // 編集機能対応
    if (editingExpenseId != null) {
      const newExpenses = expenses.map((expense) =>
        // 指定のidの支出を探して、更新する処理
        expense.id === editingExpenseId ? {...newExpense, id: editingExpenseId } : expense // ?????なんですかこれは
      )
      setExpenses(newExpenses)
      setEditingExpenseId(null)
    } else {
      setExpenses([...expenses, newExpense])
    }
    */

    setAmount('')
    setDate('')
  }

  // 収入追加機能
  const addIncome = () => {
    if (incomeAmount === '' || incomeDate === '') {
      return
    }

    const newIncome: Income = {
      id: Date.now(), // idの値の取り方を後で変える必要アリ
      amount: Number(incomeAmount),
      source: incomeSource,
      date: incomeDate,
    }

    // 編集機能対応
    if (editingIncomeId != null) {
      const newIncomes = incomes.map((income) =>
        income.id === editingIncomeId ? {...newIncome, id: editingIncomeId } : income // ?????なんですかこれは2
      )
      setIncomes(newIncomes)
      setEditingIncomeId(null)
    } else {
      setIncomes([...incomes, newIncome])
    }
    setIncomeAmount('')
    setIncomeDate('')
  }

  // 支出用削除機能
  const deleteExpense = (id: number) => {
    const newExpenses = expenses.filter((expense) => expense.id !== id)
    setExpenses(newExpenses)
  }
  // 収入用削除機能
  const deleteIncome = (id: number) => {
    const newIncomes = incomes.filter((income) => income.id !== id)
    setIncomes(newIncomes)
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
      </header>

      <br/>
      <h2>表示する月</h2>
      <p>表示する月を選択してください。</p>

      <input
        type='month'
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      /><br/>

      <main className='container'>
      
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

        <button onClick={addIncome} className='addButton'>
          追加
        </button>
        <br/><br/>
      </div>

      <h2>収入一覧</h2>
      <ul>
        {incomes.map((income, index) => (
          <li key={index}>
            {income.date} {income.source}:￥{income.amount}
            
            <button className='editButton'
              onClick={() => {
                setIncomeAmount(String(income.amount))
                setIncomeSource(income.source)
                setIncomeDate(income.date)
                setEditingIncomeId(income.id)
              }}
            >
              編集
            </button>

            <button className='deleteButton' onClick={() => deleteIncome(income.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>
      <br/>

      <div>
      <h2>支出を追加</h2>
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
      
        <button onClick={addExpense} className='addButton'>
          追加
        </button>
      </div>

      <br/>
      <h2>支出一覧</h2>
      <p>今月の支出: ¥{total}</p>

      <ul>
        {filteredExpenses.map((expense, index) => (
          <li key={index}>
            {expense.date} {expense.category}:￥{expense.amount}

            <button className='editButton'
              onClick={() => {
                setAmount(String(expense.amount))
                setCategory(expense.category)
                setDate(expense.date)
                setEditingExpenseId(expense.id)
              }}
            >
              編集
            </button>

            <button className='deleteButton' onClick={() => deleteExpense(expense.id)}>   {/*idを追加*/}
              削除
            </button>
          </li>
        ))}
      </ul>
      
      <h2>ジャンル別支出一覧</h2>
      <div className='bottom'>
      <ul>
        {Object.entries(categoryTotals).map(
          ([category, amount]) => (
            <li key={category}>
              {category}:￥{amount}
            </li>
          )
        )}
      </ul>

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
      </main>
    </div>
  )
}

export default App