import Head from 'next/head'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import vendingMachineContract from '../blockchain/vending'
import 'bulma/css/bulma.css'
import styles from '../styles/vending-machine.module.css'

const VendingMachine = ()  => {
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [inventory, setInventory] = useState('')
    const [myDonutCount, setMyDonutCount] = useState('')
    const [buyCount, setBuyCount] = useState('')
    const [web3, setweb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setVmContract] = useState(null)
    const [purchases, setPurchases] = useState(0)
    const [balance, setBalance] = useState(null)
    const [owner, setOwner] = useState(null)
    const [addstockcount, setAddstockcount] = useState(0)
    
    useEffect(() => {
        if (vmContract) getInventoryHandler()
        if (vmContract && address) getMyDonutCountHandler()
        if (vmContract && address == owner) getBalanceHandler()
        if (vmContract) getOwnerHandler()       
    }, [vmContract, address, owner])

    const getInventoryHandler = async () => {
        const inventory = await vmContract.methods.getVendingMachineStock().call()
    setInventory(inventory)
    }

    const getMyDonutCountHandler = async () => {
        const count = await vmContract.methods.donutBalances(address).call()
        setMyDonutCount(count)
    }

    const getOwnerHandler = async () => {
        const owner = await vmContract.methods.owner().call()
        setOwner(owner)
    }

    const getBalanceHandler = async () => {
        try {
            const balance = await vmContract.methods.getVendingMachineValance().call({from: address})
            setBalance(web3.utils.fromWei(balance))
        }catch (e) {
            setError(address)
        }
        
    }

    const withdrawAllHandler = async () => {
        try {
            await vmContract.methods.withdrawAll().send({
                from: address
            })
            setSuccessMsg("Withdraw done")
            if (vmContract && address == owner) getBalanceHandler()
        } catch (e) {
            setError(e.message)
        }

    }

    const updateDonutCuantity = event => {
        setBuyCount(event.target.value)
    }

    const updateStockCuantity = event => {
        setAddstockcount(event.target.value)
    }
    
    const buyDonutHandler = async () => {
        try {

            await vmContract.methods.purchase(buyCount).send({
                from: address,
                value: web3.utils.toWei('0.1', 'ether') * buyCount
            })
            setSuccessMsg(`${buyCount} donuts purchased`)
            if (vmContract) getInventoryHandler()
            if (vmContract && address) getMyDonutCountHandler()
            if (vmContract && address == owner) getBalanceHandler()
        } catch (e) { 
            setError(e.message)
        }
        
    }

    const IncreaseStockHandler = async () => {
        try {

            await vmContract.methods.restock(addstockcount).send({
                from: address
            })
            setSuccessMsg(`${addstockcount} stock added`)
            if (vmContract) getInventoryHandler()
        } catch (e) { 
            setError(e.message)
        }
        
    }

    

    const connectWalletHandler = async () => {
        if (typeof window !=="undefined" && typeof window.ethereum !=="undefined") {
            try {
                await window.ethereum.request({method: "eth_requestAccounts" })
                web3 = new Web3(window.ethereum)
                setweb3(web3)
                const accounts = await web3.eth.getAccounts()
                setAddress(accounts[0])

                const vm = vendingMachineContract(web3)
                setVmContract(vm)

                    
            } catch (err) {
                setError(err.message)
            }
            
        } else {
            // meta mask not installed
            console.log("please install metamask")
        }
    }

    return (
        <div className={styles.main}>
            <Head>
                <title>Vending Machine App</title>
                <meta name="description" content="Vending Machine test app" />
            </Head>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar-brand">
                        <h1>Vending Machine</h1>
                    </div> 
                    <div className="navbar-end">
                        <button onClick={connectWalletHandler} className="button is-primary">Connect Wallet</button>
                    </div>
                </div>
            </nav>
            <section>
                <div className="container">
                    <h2>
                        {address == null ? "Account not connected" : address == owner ? "You are owner" : "You are not owner"}

                    </h2>

                </div>
            </section>
            
            <section>
                <div className="container">
                    <h2>Vending machine balance: {balance} ETH</h2>

                </div>
            </section>
            <section className="mt-5">
                <div className="container">
                    <div className="field">
                        <label className="label"></label>
                        <button onClick={withdrawAllHandler} className="button is-primary mt-2">Withdraw All</button>
                    </div>

                </div>
            </section>
            <section>
                <div className="container">
                    <h2>Vending machine inventory: {inventory}</h2>

                </div>
            </section>
            <section>
                <div className="container">
                    <h2>Your inventory: {myDonutCount}</h2>

                </div>
            </section>
            <section className="mt-5">
                <div className="container">
                    <div className="field">
                        <label className="label"></label>
                        <div className="control">
                            <input onChange={updateDonutCuantity} type="type" className="input" placeholder="Enter amount"/>
                        </div>
                        <button onClick={buyDonutHandler} className="button is-primary mt-2">Buy</button>



                    </div>

                </div>
            </section>
            <section className="mt-5">
                <div className="container">
                    <div className="field">
                        <label className="label"></label>
                        <div className="control">
                            <input onChange={updateStockCuantity} type="type" className="input" placeholder="Enter amount"/>
                        </div>
                        <button onClick={IncreaseStockHandler} className="button is-primary mt-2">Add stock</button>



                    </div>

                </div>
            </section>
            
            <section>
                <div className="container has-text-danger">
                    <p>{error}</p>
                </div>
            </section>
            <section>
                <div className="container has-text-success">
                    <p>{successMsg}</p>
                </div>
            </section>

        </div>

    )
}

export default VendingMachine