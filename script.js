function toggleDropdownForOrder() {
    const dropdownMenu = document.querySelector('.dropdown');
    const isVisible = dropdownMenu && dropdownMenu.style.display === 'flex';

    dropdownMenu.style.display = isVisible ? 'none' : 'flex';
}

function toggleDropdownForFilter() {
    const dropdownMenu = document.querySelector('.dropdown-filter');
    const isVisible = dropdownMenu && dropdownMenu.style.display === 'block';

    dropdownMenu.style.display = isVisible ? 'none' : 'block';
}