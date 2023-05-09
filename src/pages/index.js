import { useState } from 'react'

import Head from 'next/head'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import { db } from 'firebase/client'
import { collection, addDoc } from 'firebase/firestore'

import Modal from 'components/Modal'
import Header from 'components/Header'
import ExpenseCategory from 'components/ExpenseCategory'

import { currencyFormatter } from 'utils/currencyFormatter'

export default function Home () {
  const [loading, setLoading] = useState(false)
  const [inputAmount, setInputAmount] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [modalIncomeIsOpen, setModalIncomeIsOpen] = useState(false)

  ChartJS.register(ArcElement, Tooltip, Legend)

  const DB_DATE = [
    {
      id: 1,
      title: 'ryzen 5 5600g',
      color: '#ff0',
      amount: 59180349
    },
    {
      id: 2,
      title: 'board b450m',
      color: '#000',
      amount: 3784845
    },
    {
      id: 3,
      title: 'gabinete corsair 4000d airflow ATX',
      color: '#eee',
      amount: 44264105
    },
    {
      id: 4,
      title: 'redragon KUMARA k552 rojo y RGB',
      color: 'blue',
      amount: 18634820
    },
    {
      id: 5,
      title: 'rx 550 4GB',
      color: 'red',
      amount: 46128053
    }
  ]

  const handlerIncome = async e => {
    e.preventDefault()

    if (loading) return
    setLoading(true)

    try {
      await addDoc(collection(db, 'ingresos'), {
        amount: inputAmount,
        description: inputDescription,
        createdAt: new Date()
      })
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
    setInputAmount('')
    setInputDescription('')
  }
  return (
    <>
      <Head>
        <title>Gasto app · Haz seguimiento a todos tus gastos 💸</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='description' content='Controla y haz seguimiento a todos tus gastos 💸' />
        <link rel='icon' href='https://emojitool.com/img/facebook/4.0/money-with-wings-4033.png' />
      </Head>

      <Header />

      <Modal
        show={modalIncomeIsOpen}
        onClose={setModalIncomeIsOpen}
      >
        <form className='input-group' onSubmit={handlerIncome}>
          <div className='input-group'>
            <label htmlFor='amount' className='flex px-2'>Ingrese el nuevo saldo</label>
            <input
              value={inputAmount}
              step={100}
              type='number'
              onChange={e => setInputAmount(e.target.value)}
              required
              className={`input ${loading && 'opacity-60'}`}
              placeholder='Ingrese la cantidad de saldo'
            />
          </div>
          <div className='input-group'>
            <label htmlFor='description' className='flex px-2'>Ingrese una descripción</label>
            <input
              type='text'
              value={inputDescription}
              onChange={e => setInputDescription(e.target.value)}
              required
              className={`input ${loading && 'opacity-60'}`}
              placeholder='Ingrese una descripción'
            />
          </div>
          <div className='flex justify-center'>
            <button
              type='submit'
              className={`btn btn-primary-outline w-[50%] disabled:opacity-40 ${loading && 'opacity-60'}`}
              disabled={!inputDescription.trim()}
            >
              Añadir saldo
            </button>
          </div>
        </form>
      </Modal>
      <main className='container max-w-2xl px-6 mx-auto'>
        <section className='py-2'>
          <small className='text-gray-400 text-md'>Mi saldo</small>
          <h2 className='text-4xl font-bold'>{currencyFormatter(200000)}</h2>
        </section>

        <section className='flex items-center gap-2 py-3'>
          <button className='btn btn-primary'>+ Añadir gastos</button>
          <button onClick={() => setModalIncomeIsOpen(true)} className='btn btn-primary-outline'>+ Añadir saldo</button>
        </section>

        <section className='py-6'>
          <h3 className='text-2xl'>Mis gastos</h3>
          <div className='flex flex-col gap-4 mt-6'>
            {DB_DATE.map(index => {
              return (
                <ExpenseCategory
                  key={index.id}
                  title={index.title}
                  color={index.color}
                  amount={index.amount}
                />
              )
            })}
          </div>
        </section>

        <section className='py-6'>
          <h3 className='text-2xl'>Estadísticas</h3>
          <div className='xl:w-1/3 2xl:w-1/3 mx-auto md:1/4 sm:w-1/4'>
            <Doughnut
              data={{
                labels: DB_DATE.map(index => index.title),
                datasets: [
                  {
                    label: 'Expenses',
                    data: DB_DATE.map(index => index.amount),
                    backgroundColor: DB_DATE.map(index => index.color),
                    borderColor: '#000',
                    borderWidth: 3
                  }
                ]
              }}
            />
          </div>
        </section>
      </main>
    </>
  )
}
