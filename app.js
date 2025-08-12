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

function filterWorks(searchTerm) {
    const works = document.querySelectorAll('#Works .work-item');
    works.forEach(work => {
        const title = work.querySelector('h4');
        const description = work.querySelector('p');
        const text = work.innerText.toLowerCase();

        if (text.includes(searchTerm.toLowerCase())) {
            work.style.display = '';
            title.innerHTML = title.textContent;
            description.innerHTML = description.textContent;
            if (searchTerm) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                title.innerHTML = title.textContent.replace(regex, '<mark>$1</mark>');
                description.innerHTML = description.textContent.replace(regex, '<mark>$1</mark>');
            }
        } else {
            work.style.display = 'none';
        }
    });
}

// Toggle icon between search & clear
searchInput.addEventListener('input', () => {
    filterWorks(searchInput.value);
    searchToggle.textContent = searchInput.value ? '✖' : '🔍';
});

// When clicking icon
searchToggle.addEventListener('click', () => {
    if (searchInput.value) {
        searchInput.value = '';
        filterWorks('');
        searchToggle.textContent = '🔍';
    }
});

populateSuggestions();

// Watch for content changes
const worksContainer = document.querySelector('#Works');
if (worksContainer) {
    const observer = new MutationObserver(populateSuggestions);
    observer.observe(worksContainer, { childList: true, subtree: true });
}
