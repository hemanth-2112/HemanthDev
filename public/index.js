'use strict';

//Toggle Function

const elemToggleFunc = function (elem) { elem.classList.toggle('active'); }

// Header Sticky & Go-Top

const header = document.querySelector('[data-header]');
const goTopBtn = document.querySelector('[data-go-top]');
window.addEventListener('scroll', function () {
    if (window.scrollY >= 10) { header.classList.add('active'); goTopBtn.classList.add('active'); }
    else { header.classList.remove('active'); goTopBtn.classList.remove('active'); }
});

// Mobile Menu

const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbar = document.querySelector('[data-navbar]');

navToggleBtn.addEventListener('click', function () {
    elemToggleFunc(navToggleBtn);
    elemToggleFunc(navbar);
    elemToggleFunc(document.body);
})

// Skills Toggling Button

const toggleBtnBox = document.querySelector('[data-toggle-box]');
const toggleBtns = document.querySelectorAll('[data-toggle-btn]');
const skillsBox = document.querySelector('[data-skills-box]');

for (let i = 0; i < toggleBtns.length; i++) {
    toggleBtns[i].addEventListener('click', function () {
        elemToggleFunc(toggleBtnBox);

        for (let i = 0; i < toggleBtns.length; i++) { elemToggleFunc(toggleBtns[i]); }
        elemToggleFunc(skillsBox);
    });
}

// Dark & Light Theme Toggle

const themeToggleBtn = document.querySelector('[data-theme-btn]');

themeToggleBtn.addEventListener('click', function () {
    elemToggleFunc(themeToggleBtn);

    if (themeToggleBtn.classList.contains('active')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');

        localStorage.setItem('theme', 'light-theme');
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');

        localStorage.setItem('theme', 'dark-theme');
    }
})

//Applying Theme kept in Local Storage 

if (localStorage.getItem('theme') === 'light-theme') {
    themeToggleBtn.classList.add('active');
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
} else {
    themeToggleBtn.classList.remove('active');
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
}

//form validation
const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = form.elements['name'].value;
    const email = form.elements['email'].value;
    const phone = form.elements['phone'].value;
    const message = form.elements['message'].value;

    const formData = {
        name: name,
        email: email,
        phone: phone,
        message: message
    };

    // Validate form data
    if (!name || !email || !phone || !message) {
        alert('Please fill in all fields.');
        return;
    }
    if (!/^[a-zA-Z ]+$/.test(name)) {
        alert('Name can only contain letters and spaces.');
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
        alert('Phone number must be 10 digits long.');
        return;
    }
    if (message.length < 10) {
        alert('Message must be at least 10 characters long.');
        return;
    }
    // Send form data to server

    try {
        await fetch('https://hemanthdev.onrender.com/api/form', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert('Form submitted successfully!');
                form.reset();
            } else {
                alert('There was a problem with your submission. Please try again.');
            }
        });
    } catch (error) {
        console.error('Error submitting form:', error);
    }
})
