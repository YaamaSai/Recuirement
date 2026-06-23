document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on a jobs page
    const jobCards = document.querySelectorAll('.job-card');
    if (jobCards.length === 0) return;

    const searchForm = document.getElementById('job-search-form');
    const searchTitle = document.getElementById('search-title');
    const searchLocation = document.getElementById('search-location');
    const categoryChips = document.querySelectorAll('.category-chip');
    const jobTypeCheckboxes = document.querySelectorAll('.filter-job-type');
    const expCheckboxes = document.querySelectorAll('.filter-experience');
    const salaryFilter = document.getElementById('filter-salary');
    const sortFilter = document.getElementById('sort-jobs');
    const jobsGrid = document.querySelector('.jobs-grid');
    const showingCount = document.querySelector('.jobs-main p');

    // Add event listeners
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
        });
    }

    // Live search on input
    if (searchTitle) searchTitle.addEventListener('input', applyFilters);
    if (searchLocation) searchLocation.addEventListener('input', applyFilters);
    
    if (salaryFilter) salaryFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);

    jobTypeCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
    expCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));

    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            applyFilters();
        });
    });

    function applyFilters() {
        const titleQuery = searchTitle ? searchTitle.value.toLowerCase() : '';
        const locationQuery = searchLocation ? searchLocation.value.toLowerCase() : '';
        
        const activeCategoryChip = document.querySelector('.category-chip.active');
        const activeCategory = activeCategoryChip ? activeCategoryChip.textContent.trim() : 'All Jobs';

        const activeJobTypes = Array.from(jobTypeCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const activeExps = Array.from(expCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const salaryVal = salaryFilter ? salaryFilter.value : 'any';
        
        let visibleCount = 0;
        let cardsArray = Array.from(jobCards);

        cardsArray.forEach(card => {
            let isVisible = true;

            const cardTitle = (card.dataset.title || '').toLowerCase();
            const cardCompany = (card.dataset.company || '').toLowerCase();
            const cardLocation = (card.dataset.location || '').toLowerCase();
            const cardCategory = card.dataset.category || '';
            const cardType = card.dataset.type || '';
            const cardLevel = card.dataset.level || '';
            const cardSalaryMin = parseInt(card.dataset.salaryMin) || 0;
            const cardSalaryMax = parseInt(card.dataset.salaryMax) || 0;

            // Search filter
            if (titleQuery && !cardTitle.includes(titleQuery) && !cardCompany.includes(titleQuery)) {
                isVisible = false;
            }
            if (locationQuery && !cardLocation.includes(locationQuery) && cardLocation !== 'remote') {
                // If location query is provided, check if it matches location. If job is remote, it might still match or not. 
                // Let's make remote a match if query is 'remote'
                if (locationQuery === 'remote' && cardLocation === 'remote') {
                    // Match
                } else if (!cardLocation.includes(locationQuery)) {
                    isVisible = false;
                }
            }

            // Category filter
            if (activeCategory !== 'All Jobs' && cardCategory !== activeCategory) {
                isVisible = false;
            }

            // Checkbox filters (OR logic within the same group)
            if (activeJobTypes.length > 0 && !activeJobTypes.includes(cardType)) {
                isVisible = false;
            }
            
            if (activeExps.length > 0 && !activeExps.includes(cardLevel)) {
                isVisible = false;
            }

            // Salary filter
            if (salaryVal !== 'any') {
                if (salaryVal === '50k-80k' && (cardSalaryMin > 80000 || cardSalaryMax < 50000)) isVisible = false;
                if (salaryVal === '80k-120k' && (cardSalaryMin > 120000 || cardSalaryMax < 80000)) isVisible = false;
                if (salaryVal === '120k-150k' && (cardSalaryMin > 150000 || cardSalaryMax < 120000)) isVisible = false;
                if (salaryVal === '150k+' && cardSalaryMax < 150000) isVisible = false;
            }

            card.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        // Update count text
        if (showingCount) {
            showingCount.textContent = `Showing ${visibleCount} job${visibleCount !== 1 ? 's' : ''}`;
        }

        // Apply sorting
        const sortVal = sortFilter ? sortFilter.value : 'relevant';
        if (sortVal !== 'relevant') {
            const visibleCards = cardsArray.filter(card => card.style.display !== 'none');
            
            visibleCards.sort((a, b) => {
                if (sortVal === 'salary') {
                    return (parseInt(b.dataset.salaryMax) || 0) - (parseInt(a.dataset.salaryMax) || 0);
                }
                return 0;
            });

            // Re-append to grid
            visibleCards.forEach(card => jobsGrid.appendChild(card));
        } else {
            // Restore original order
            cardsArray.forEach(card => jobsGrid.appendChild(card));
        }
    }
    
    // Initial run to apply default checked filters
    applyFilters();
});
