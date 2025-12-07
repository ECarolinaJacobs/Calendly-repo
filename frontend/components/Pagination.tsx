const Pagination = ({totalRooms, roomsPerPage, currentPage, setCurrentPage} : any) => {
    let pages = [];

    for (let i = 1; i <= Math.ceil(totalRooms / roomsPerPage); i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">
            <div className='page-switcher'>
                <button className="prev-button" onClick={() => currentPage > 1 ? setCurrentPage(currentPage - 1) : null}>Previous</button>
                <button className="next-button" onClick={() => currentPage !== pages.length ? setCurrentPage(currentPage + 1) : null}>Next</button>
            </div>
            <p className="page-count">{currentPage}/{pages[pages.length - 1]}</p>
        </div>
    ) 
}

export default Pagination;