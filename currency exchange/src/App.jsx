import "./index.css"
import {useState, useEffect} from "react";

export default function App() {

    const [currencies, setCurrencies] = useState([]) // State to get currency names from API
    const [fromCurrency, setFromCurrency] = useState("EUR");
    const [toCurrency, setToCurrency] = useState("USD");
    const [result, setResult] = useState(null);
    const [amount, setAmount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCurrencies() {
            try{
                const response = await fetch("https://api.frankfurter.dev/v1/currencies");
                const data = await response.json();
                setCurrencies(Object.keys(data));
            } catch {
                setError("Failed to convert currencies from API");
            }
        }
        loadCurrencies();
    }, [])

    /*Fetch API to get exchange rates and final result on amount or currency change*/
    async function getResult() {
        try{
            if (!amount || amount <= 0) {
                setError("Amount should be grater than 0");
                return
            }
            setLoading(true);
            setError(null);
            if (amount && toCurrency === fromCurrency) {
                setResult(amount)
                return
            }
            const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${fromCurrency}&symbols=${toCurrency}`);
            const { rates } = await response.json();
            setResult((rates[toCurrency] * amount).toFixed(2));
        } catch {
            setError("Failed to convert currencies from API");
        } finally {
            setLoading(false);
        }

    }

    /* render loading during loading*/
    function renderLoading (){
        return <p className={'loading'}>Converting...</p>
    }
    /* render result */
    function renderResult (){
        return <p className={'result'}>{`${amount} ${fromCurrency} = ${result} ${toCurrency}`}</p>
    }
    /* render error */
    function renderError (){
        return <p className={'error'}>{error}</p>
    }

    return (
        <div className="app">
            <h1>Currency exchange Calculator</h1>
            <div className={'converter-container'}>
                {error && renderError()}
                <div className={'input-group'}>
                    <input
                        type="text"
                        className={'input-field'}
                        placeholder={'Amount'}
                        onChange={(e) => {
                            setError(null)
                            setAmount(e.target.value)
                        }}
                    />
                    <select className={'dropdown'} onChange={(e) => {
                        setResult(null)
                        setFromCurrency(e.target.value)}} value={fromCurrency}>
                        {currencies.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <span className={'arrow'}>➡</span>
                    <select className={'dropdown'} onChange={(e) => {
                        setResult(null)
                        setToCurrency(e.target.value)}} value={toCurrency}>
                        {currencies.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                <button className={'convert-button'} onClick={() => getResult()} >Convert</button>
                {loading && renderLoading()}
                {!error && !loading && result && renderResult()}
            </div>
        </div>
    )
}