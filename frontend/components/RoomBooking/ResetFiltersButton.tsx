// Use one parameter/usestate for filtering

const ResetFiltersButton = ({onReset} : any) => {

    return (
        <button className="reset-filters-button" onClick={onReset}>
            <img className='refresh-icon' src="public/refresh-icon.png" alt="refresh icon" />
        </button>
    )
}

export default ResetFiltersButton;