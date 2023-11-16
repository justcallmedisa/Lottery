import { useState, useEffect } from 'react'
import Head from 'next/head'
import Web3 from 'web3'
import lotteryContract from '../blockchain/lottery'
import styles from '@/styles/Home.module.css'
import 'bulma/css/bulma.css'

export default function Home() {
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState()
  const [lcContract, setLcContract] = useState()
  const [lotteryPot, setLotteryPot] = useState()
  const [lotteryPlayers, setPlayers] = useState([])

  useEffect(() => {
    if (lcContract) getPot()
    if (lcContract) getPlayers()
  }, [lcContract, lotteryPot, lotteryPlayers]) 

  const getPot = async () => {
    const pot = await lcContract.methods.getBalance().call()
    setLotteryPot(web3.utils.fromWei(pot, 'ether'))
  }

  const getPlayers = async () => {
    const players = await lcContract.methods.getPlayers().call()
    setPlayers(players)
  }

  const enterLotteryHandler = async () => {
    try {
      await lcContract.methods.enter().send({
        from: address,
        value: '12000000000000000',
        gasLimit: 30000,
        gasPrice: 20000000000,
      })
    } catch(err) {
      console.log(err.message)
    }
  }

  const pickWinnerHandler = async () => {
    try {
      await lcContract.methods.pickWinner().send({
        from: address,
        gasLimit: 30000,
        gasPrice: 20000000000,
      })
    } catch(err) {
      console.log(err.message)
    }
  } 

  const connectWalletHandler = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({method: "eth_requestAccounts"})
        
        const web3 = new Web3(window.ethereum)
        
        setWeb3(web3)
        
        const accounts = await web3.eth.getAccounts()

        setAddress(accounts[0])

        const lc = lotteryContract(web3)
        setLcContract(lc)

      }
      catch(err){
        console.log(err.message)
      }
    }
    else {
      console.log("Please install MetaMask")
    }
  }

  return (
    <div>
      <Head>
        <title>Ether Lottery</title>
        <meta name="description" content="An Ethereum Lottery dApp"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav className='navbar mt-4 mb-4'>
          <div className='container'>
            <div className='navbar-brand'>
              <h1>Ether Lottery</h1>
            </div>
            <div className='navbar-end'>
              <button onClick={connectWalletHandler} className='button is-link'>Connect Wallet</button>
            </div>
          </div>
        </nav>
        <div className='container'>
          <section className='mt-5'>
            <div className='columns'>
              <div className='column is-two-thirds'>
                <section className='mt-5'>
                  <p>Enter the Lottery</p>
                  <button onClick={enterLotteryHandler} className='button is-link is-middle is-dark mt-3'>Play Now</button>
                </section>
                <section className='mt-6'>
                  <p><b>Admin only:</b> Pick Winner</p>
                  <button onClick={pickWinnerHandler} className='button is-primary is-middle is-dark mt-3'>Pick Winner</button>
                </section>
              </div>
              <div className='column is-one-third'>
              <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Players {lotteryPlayers && lotteryPlayers.length}</h2>
                        {lotteryPlayers && lotteryPlayers.length > 0 && (
                          <ul>
                            {lotteryPlayers.map((player, index) => (
                              <li key={index}>
                                <a href={`https://etherscan.io/address/${player}`} target="_blank" rel="noopener noreferrer">
                                  {player}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
                <section className='mt-5'>
                  <div className='card'>
                    <div className='card-content'>
                      <div className='content'>
                        <h2>Pot</h2>
                        <p>{lotteryPot} Ether</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}
