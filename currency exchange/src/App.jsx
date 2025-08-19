import "./index.css"
import {useState, useEffect} from "react";
import SelectCurrency from "./components/selectCurrency.jsx";
import getCurrenciesName from "./handlers/getCurrenciesNames.js";

export default function App() {

    /* Getting currency names available at API*/
    const currenciesNamesList = [...getCurrenciesName()]

    /* States of input amount to convert and currencies names*/
    const [amount, setAmount] = useState(null)
    const [fromCurrency, setFromCurrency] = useState("USD")
    const [toCurrency, setToCurrency] = useState("USD")

    /* States of a result, error or loading statuses*/
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    /*Fetch API to get exchange rates and final result on amount or currency change*/
    useEffect(() => {
        setLoading(true)
        async function getResult () {
            if(fromCurrency === toCurrency) {
                return amount
            }
            const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${fromCurrency}&symbols=${toCurrency}`)
            const { rates } = await response.json()
            return (rates[toCurrency] * amount).toFixed(2)
        }
        setResult(getResult())
        setLoading(false)
    }, [amount, fromCurrency, toCurrency])


    /* render loading during loading*/
    function renderLoading (){
        return <p className={'loading'}>Loading...</p>
    }
    /* render result */
    function renderResult (){
        return <p className={'result'}>{result}</p>
    }
    /* render error */
    function renderError (){
        return <p className={'error'}>{error}</p>
    }

    return (
        <div className="app">
            <h1>Currency exchange Calculator</h1>
            <div className={'converter-container'}>
                <div className={'input-group'}>
                    <input
                        type="text"
                        className={'input-field'}
                        placeholder={'Amount'}
                        onChange={(e) => {
                            setAmount(e.target.value)
                        }}
                    />
                    <SelectCurrency onChange={setFromCurrency} currenciesNamesList={currenciesNamesList} value={fromCurrency}/>
                    <span className={'arrow'}>➡</span>
                    <SelectCurrency onChange={setToCurrency} currenciesNamesList={currenciesNamesList} value={toCurrency}/>
                </div>
                <button className={'convert-button'} >Convert</button>
                    {error && renderError()}
                    {loading && renderLoading()}
                    {!error && !loading && result && renderResult()}
            </div>
        </div>
    )
}