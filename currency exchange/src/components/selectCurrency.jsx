export default function SelectCurrency({currenciesNamesList, onChange, value}) {
    return (
        <select value={value} className={'dropdown'}
                onChange={(e) => {
                    onChange(e.target.value)
                }}>
            {currenciesNamesList.map(name => {
                return (
                    <option key={name} value={name}>{name}</option>
                )
            })}
        </select>
    )
}

