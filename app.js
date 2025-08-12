// Professional Portfolio Web App - Enhanced with harmonious tab functionality
'use strict';

// Theme Switcher Event Handler
const switcher = document.querySelector('.btn');
switcher.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');

    const className = document.body.className;
    if (className == "light-theme") {
        this.textContent = "Dark";
    } else {
        this.textContent = "Light";
    }

    console.log('current class name: ' + className);
});

// Enhanced Tab Functionality for Portfolio Sections
function openSection(event, sectionName) {
    // Get all elements with class="tabcontent" and hide them
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // Get all elements with class="tablinks" and remove the "active" class
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show the current tab and add an "active" class to the button that opened the tab
    document.getElementById(sectionName).classList.add("active");
    event.currentTarget.classList.add("active");
}

// Search and Filter functionality variables
let searchInput, searchToggle, suggestionsList, workItems = [];
let categoryFilter, tagFilter, yearFilter, clearFiltersBtn;

// Initialize search and filter functionality
function initSearch() {
    console.log('Starting initSearch...');
    
    searchInput = document.getElementById('worksSearch');
    searchToggle = document.getElementById('searchToggle');
    suggestionsList = document.getElementById('worksSuggestions');
    categoryFilter = document.getElementById('categoryFilter');
    tagFilter = document.getElementById('tagFilter');
    yearFilter = document.getElementById('yearFilter');
    clearFiltersBtn = document.getElementById('clearFilters');
    
    console.log('Elements found:', {
        searchInput: !!searchInput,
        searchToggle: !!searchToggle,
        suggestionsList: !!suggestionsList,
        categoryFilter: !!categoryFilter,
        tagFilter: !!tagFilter,
        yearFilter: !!yearFilter,
        clearFiltersBtn: !!clearFiltersBtn
    });
    
    if (searchInput && searchToggle && suggestionsList) {
        console.log('Basic search elements found, initializing...');
        
        try {
            initWorkItems();
            populateSuggestions();
            addResultsCounter();
            
            // Search input event listener
            searchInput.addEventListener('input', () => {
                applyFilters();
                searchToggle.textContent = searchInput.value ? 'Clear' : 'Search';
            });

            // Search toggle event listener
            searchToggle.addEventListener('click', () => {
                if (searchInput.value) {
                    searchInput.value = '';
                    applyFilters();
                    searchToggle.textContent = 'Search';
                }
            });
            
            // Filter event listeners
            if (categoryFilter) {
                categoryFilter.addEventListener('change', applyFilters);
                console.log('Category filter listener added');
            }
            if (tagFilter) {
                tagFilter.addEventListener('change', applyFilters);
                console.log('Tag filter listener added');
            }
            if (yearFilter) {
                yearFilter.addEventListener('change', applyFilters);
                console.log('Year filter listener added');
            }
            if (clearFiltersBtn) {
                clearFiltersBtn.addEventListener('click', clearAllFilters);
                console.log('Clear filters button listener added');
            }
            
            console.log('Search functionality initialized successfully');
        } catch (error) {
            console.error('Error during search initialization:', error);
        }
    } else {
        console.error('Required search elements not found:', {
            searchInput: !!searchInput,
            searchToggle: !!searchToggle,
            suggestionsList: !!suggestionsList
        });
    }
}

function initWorkItems() {
    const items = document.querySelectorAll('#Works .work-item');
    workItems = Array.from(items).map(work => {
        const titleEl = work.querySelector('h4');
        const descEl = work.querySelector('p:not(.work-date)');
        const dateEl = work.querySelector('.work-date');
        const tagEls = work.querySelectorAll('.tag');
        
        // Determine category based on parent section OR if it's outside a category section
        const parentSection = work.closest('.category-section');
        let category = 'projects'; // Default to projects
        
        if (parentSection) {
            const categoryHeader = parentSection.querySelector('h3')?.textContent.toLowerCase();
            if (categoryHeader && categoryHeader.includes('publication')) {
                category = 'publications';
            }
        } else {
            // If not in a category section, it's likely a standalone project
            category = 'projects';
        }
        
        // Extract tags and make them lowercase for easier matching
        const tags = Array.from(tagEls).map(tag => tag.textContent.toLowerCase().trim());
        
        // Extract year from date
        const dateText = dateEl ? dateEl.textContent : '';
        const yearMatch = dateText.match(/\b(20\d{2})\b/);
        const year = yearMatch ? yearMatch[1] : '';
        
        console.log('Work item processed:', {
            title: titleEl?.textContent,
            category: category,
            tags: tags,
            year: year
        });
        
        return {
            element: work,
            titleEl: titleEl,
            descEl: descEl,
            title: titleEl?.textContent || '',
            desc: descEl?.textContent || '',
            category: category,
            tags: tags,
            year: year,
            dateText: dateText
        };
    });
    
    console.log('Total work items processed:', workItems.length);
}

function populateSuggestions() {
    if (suggestionsList && workItems.length > 0) {
        suggestionsList.innerHTML = '';
        const uniqueTitles = new Set(workItems.map(w => w.title.trim()));
        uniqueTitles.forEach(title => {
            const option = document.createElement('option');
            option.value = title;
            suggestionsList.appendChild(option);
        });
    }
}

function addResultsCounter() {
    const worksContent = document.querySelector('#Works .works-content');
    if (worksContent && !document.querySelector('.filter-results')) {
        const resultsCounter = document.createElement('div');
        resultsCounter.className = 'filter-results';
        resultsCounter.textContent = `Showing ${workItems.length} items`;
        worksContent.insertBefore(resultsCounter, worksContent.firstChild);
    }
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedTag = tagFilter ? tagFilter.value : 'all';
    const selectedYear = yearFilter ? yearFilter.value : 'all';
    
    console.log('Applying filters:', {
        searchTerm: searchTerm,
        selectedCategory: selectedCategory,
        selectedTag: selectedTag,
        selectedYear: selectedYear
    });
    
    let visibleCount = 0;
    
    workItems.forEach(work => {
        let shouldShow = true;
        
        // Apply search filter
        if (searchTerm && searchTerm.trim() !== '') {
            const textMatch = (work.title + ' ' + work.desc).toLowerCase();
            if (!textMatch.includes(searchTerm)) {
                shouldShow = false;
            }
        }
        
        // Apply category filter
        if (selectedCategory !== 'all' && work.category !== selectedCategory) {
            shouldShow = false;
            console.log(`Category filter hiding: ${work.title} (category: ${work.category}, selected: ${selectedCategory})`);
        }
        
        // Apply tag filter - check if ANY of the work's tags match the selected tag
        if (selectedTag !== 'all') {
            const hasMatchingTag = work.tags.some(tag => 
                tag.includes(selectedTag) || selectedTag.includes(tag)
            );
            if (!hasMatchingTag) {
                shouldShow = false;
                console.log(`Tag filter hiding: ${work.title} (tags: ${work.tags}, selected: ${selectedTag})`);
            }
        }
        
        // Apply year filter
        if (selectedYear !== 'all' && work.year !== selectedYear) {
            shouldShow = false;
            console.log(`Year filter hiding: ${work.title} (year: ${work.year}, selected: ${selectedYear})`);
        }
        
        // Show/hide the work item
        if (shouldShow) {
            work.element.style.display = '';
            visibleCount++;
            
            // Reset and highlight text
            if (work.titleEl) work.titleEl.innerHTML = work.title;
            if (work.descEl) work.descEl.innerHTML = work.desc;
            
            if (searchTerm && searchTerm.length > 0) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                if (work.titleEl) work.titleEl.innerHTML = work.title.replace(regex, '<mark>$1</mark>');
                if (work.descEl) work.descEl.innerHTML = work.desc.replace(regex, '<mark>$1</mark>');
            }
        } else {
            work.element.style.display = 'none';
        }
    });
    
    console.log(`Filter result: ${visibleCount} items visible out of ${workItems.length}`);
    
    // Update results counter
    updateResultsCounter(visibleCount);
    
    // Show/hide category sections based on visible items
    updateCategorySections();
}

function updateResultsCounter(count) {
    const resultsCounter = document.querySelector('.filter-results');
    if (resultsCounter) {
        const total = workItems.length;
        if (count === total) {
            resultsCounter.textContent = `Showing all ${total} items`;
        } else {
            resultsCounter.textContent = `Showing ${count} of ${total} items`;
        }
    }
}

function updateCategorySections() {
    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach(section => {
        const visibleItems = section.querySelectorAll('.work-item');
        let hasVisibleItems = false;
        
        visibleItems.forEach(item => {
            if (item.style.display !== 'none') {
                hasVisibleItems = true;
            }
        });
        
        if (hasVisibleItems) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });
}

function clearAllFilters() {
    // Clear search input
    if (searchInput) {
        searchInput.value = '';
        searchToggle.textContent = 'Search';
    }
    
    // Reset all filter dropdowns
    if (categoryFilter) categoryFilter.value = 'all';
    if (tagFilter) tagFilter.value = 'all';
    if (yearFilter) yearFilter.value = 'all';
    
    // Apply filters (which will show all items)
    applyFilters();
}

function filterWorks(term) {
    // This function is kept for backward compatibility but now uses applyFilters
    applyFilters();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing...');
    
    // Make sure About section is visible on page load
    const aboutSection = document.getElementById('About');
    const aboutButton = document.querySelector('.tablinks[onclick*="About"]');
    
    if (aboutSection && aboutButton) {
        aboutSection.classList.add('active');
        aboutButton.classList.add('active');
        console.log('About section initialized');
    }
    
    // Add smooth scroll behavior for better user experience
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize search functionality with delay to ensure DOM is ready
    setTimeout(() => {
        console.log('Initializing search functionality...');
        initSearch();
    }, 100);
    
    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
    
    // Handle newsletter subscription
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        const subscribeBtn = subscribeForm.querySelector('.subscribe-btn');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const emailInput = subscribeForm.querySelector('.email-input');
                if (emailInput && emailInput.value && emailInput.value.includes('@')) {
                    alert('Thank you for subscribing to my weekly column!');
                    emailInput.value = '';
                } else {
                    alert('Please enter a valid email address.');
                }
            });
        }
    }
    
    // Add smooth animations for work items and posts
    const workItemsForAnimation = document.querySelectorAll('.work-item, .post');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    workItemsForAnimation.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const activeTab = document.querySelector('.tablinks.active');
        const allTabs = Array.from(document.querySelectorAll('.tablinks'));
        const currentIndex = allTabs.indexOf(activeTab);
        
        let newIndex;
        if (event.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
        } else {
            newIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
        }
        
        // Simulate click on the new tab
        allTabs[newIndex].click();
        allTabs[newIndex].focus();
    }
});
