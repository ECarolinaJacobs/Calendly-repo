const ResetFiltersButton = ({onReset} : any) => {

    return (
        <button className="reset-filters-button" onClick={onReset}>
            <img className='refresh-icon' src="/refresh-icon.png" alt="refresh icon" />
        </button>
    )
}

export default ResetFiltersButton;