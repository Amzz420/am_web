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

// Initialize the page - ensure About section is active by default
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
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = subscribeForm.querySelector('.email-input');
            if (emailInput.value && emailInput.value.includes('@')) {
                alert('Thank you for subscribing to my weekly column!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
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

// Add smooth animations for work items and posts
document.addEventListener('DOMContentLoaded', function() {
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

function switchTheme() {
  document.body.classList.add('theme-fade');

  setTimeout(() => {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    document.body.classList.remove('theme-fade');
  }, 150);
}
const searchInput = document.getElementById('worksSearch');
const searchToggle = document.getElementById('searchToggle');
const suggestionsList = document.getElementById('worksSuggestions');

function populateSuggestions() {
    suggestionsList.innerHTML = '';
    const titles = document.querySelectorAll('#Works .work-item h4');
    const uniqueTitles = new Set();

    titles.forEach(title => {
        const text = title.textContent.trim();
        if (!uniqueTitles.has(text)) {
            uniqueTitles.add(text);
            const option = document.createElement('option');
            option.value = text;
            suggestionsList.appendChild(option);
        }
    });
}

const searchInput = document.getElementById('worksSearch');
const searchToggle = document.getElementById('searchToggle');
const suggestionsList = document.getElementById('worksSuggestions');

// Store original titles & descriptions
let workItems = [];

function initWorkItems() {
    const items = document.querySelectorAll('#Works .work-item');
    workItems = Array.from(items).map(work => ({
        element: work,
        titleEl: work.querySelector('h4'),
        descEl: work.querySelector('p'),
        title: work.querySelector('h4')?.textContent || '',
        desc: work.querySelector('p')?.textContent || ''
    }));
}

function populateSuggestions() {
    suggestionsList.innerHTML = '';
    const uniqueTitles = new Set(workItems.map(w => w.title.trim()));
    uniqueTitles.forEach(title => {
        const option = document.createElement('option');
        option.value = title;
        suggestionsList.appendChild(option);
    });
}

function filterWorks(term) {
    const searchTerm = term.toLowerCase();
    workItems.forEach(work => {
        const textMatch = (work.title + ' ' + work.desc).toLowerCase();
        if (textMatch.includes(searchTerm)) {
            work.element.style.display = '';
            // Reset text
            work.titleEl.textContent = work.title;
            work.descEl.textContent = work.desc;
            // Highlight
            if (searchTerm) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                work.titleEl.innerHTML = work.title.replace(regex, '<mark>$1</mark>');
                work.descEl.innerHTML = work.desc.replace(regex, '<mark>$1</mark>');
            }
        } else {
            work.element.style.display = 'none';
        }
    });
}

// Toggle search/clear icon
searchInput.addEventListener('input', () => {
    filterWorks(searchInput.value);
    searchToggle.textContent = searchInput.value ? '✖' : '🔍';
});

searchToggle.addEventListener('click', () => {
    if (searchInput.value) {
        searchInput.value = '';
        filterWorks('');
        searchToggle.textContent = '🔍';
    }
});

// Initialize on page load
initWorkItems();
populateSuggestions();

// Mobile-friendly Tab System
document.addEventListener("DOMContentLoaded", () => {
    const tabLinks = document.querySelectorAll(".tablinks");
    const tabContents = document.querySelectorAll(".tabcontent");

    tabLinks.forEach(link => {
        link.addEventListener("click", e => {
            const targetId = link.getAttribute("onclick")
                ?.match(/'([^']+)'/)[1]; // Extract ID from onclick
            if (!targetId) return;

            // Hide all tabs
            tabContents.forEach(tab => tab.classList.remove("active"));

            // Remove active state from buttons
            tabLinks.forEach(btn => btn.classList.remove("active"));

            // Show clicked tab
            document.getElementById(targetId).classList.add("active");
            link.classList.add("active");

            // Smooth scroll to top on mobile
            if (window.innerWidth <= 768) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });

        // If link has ondblclick, replace it with long press on mobile
        if (link.getAttribute("ondblclick")) {
            let pressTimer;
            link.addEventListener("touchstart", () => {
                pressTimer = setTimeout(() => {
                    const pageUrl = link.getAttribute("ondblclick")
                        .match(/'([^']+)'/)[1];
                    window.location.href = pageUrl;
                }, 600); // long press = 0.6s
            });
            link.addEventListener("touchend", () => clearTimeout(pressTimer));
        }
    });
});
