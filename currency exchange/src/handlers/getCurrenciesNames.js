import {useState, useEffect} from "react";

 export default function getCurrenciesNames() {

     /* Getting all available currencies names from API */
    const [currencies, setCurrencies] = useState({}) // State to get currency names from API
    const result = []

    useEffect(() => {
        async function loadCurrencies() {
            const response = await fetch("https://api.frankfurter.dev/v1/currencies");
            const data = await response.json();
            setCurrencies(data);
        }
        loadCurrencies();
    }, [])

     for (const currency in currencies ) {
         result.push(currency)
     }
     return result
}

