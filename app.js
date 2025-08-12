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

// Search functionality variables
let searchInput, searchToggle, suggestionsList, workItems = [];

// Initialize search functionality
function initSearch() {
    searchInput = document.getElementById('worksSearch');
    searchToggle = document.getElementById('searchToggle');
    suggestionsList = document.getElementById('worksSuggestions');
    
    if (searchInput && searchToggle && suggestionsList) {
        initWorkItems();
        populateSuggestions();
        
        // Search input event listener
        searchInput.addEventListener('input', () => {
            filterWorks(searchInput.value);
            searchToggle.textContent = searchInput.value ? 'Clear' : 'Search';
        });

        // Search toggle event listener
        searchToggle.addEventListener('click', () => {
            if (searchInput.value) {
                searchInput.value = '';
                filterWorks('');
                searchToggle.textContent = 'Search';
            }
        });
    }
}

function initWorkItems() {
    const items = document.querySelectorAll('#Works .work-item');
    workItems = Array.from(items).map(work => ({
        element: work,
        titleEl: work.querySelector('h4'),
        descEl: work.querySelector('p:not(.work-date)'), // Exclude date paragraph
        title: work.querySelector('h4')?.textContent || '',
        desc: work.querySelector('p:not(.work-date)')?.textContent || ''
    }));
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

function filterWorks(term) {
    const searchTerm = term.toLowerCase();
    workItems.forEach(work => {
        const textMatch = (work.title + ' ' + work.desc).toLowerCase();
        if (textMatch.includes(searchTerm) || searchTerm === '') {
            work.element.style.display = '';
            // Reset text
            if (work.titleEl) work.titleEl.innerHTML = work.title;
            if (work.descEl) work.descEl.innerHTML = work.desc;
            // Highlight
            if (searchTerm && searchTerm.length > 0) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                if (work.titleEl) work.titleEl.innerHTML = work.title.replace(regex, '<mark>$1</mark>');
                if (work.descEl) work.descEl.innerHTML = work.desc.replace(regex, '<mark>$1</mark>');
            }
        } else {
            work.element.style.display = 'none';
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Make sure About section is visible on page load
    const aboutSection = document.getElementById('About');
    const aboutButton = document.querySelector('.tablinks[onclick*="About"]');
    
    if (aboutSection && aboutButton) {
        aboutSection.classList.add('active');
        aboutButton.classList.add('active');
    }
    
    // Add smooth scroll behavior for better user experience
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize search functionality
    initSearch();
    
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
    const workItems = document.querySelectorAll('.work-item, .post');
    
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
    
    workItems.forEach(item => {
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
