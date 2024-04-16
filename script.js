// Register form
const registerForm = document.getElementById('register-form');
const registerFullnameInput = document.getElementById('register-fullname');
const registerEmailInput = document.getElementById('register-email');
const registerMobileInput = document.getElementById('register-mobile');
const registerUsernameInput = document.getElementById('register-username');
const registerPasswordInput = document.getElementById('register-password');
const registerLink = document.getElementById('register-link');
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fullname = registerFullnameInput.value;
    const email = registerEmailInput.value;
    const mobile = registerMobileInput.value;
    const username = registerUsernameInput.value;
    const password = registerPasswordInput.value;

    // Check if the username is already taken
    const registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    if (registeredUsers.find(u => u.username === username)) {
        alert('Username already taken');
        return;
    }

    // Save the new user to session storage
    const newUser = { fullname, email, mobile, username, password };
    registeredUsers.push(newUser);
    sessionStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('Registration successful! Please log in.');
    showLoginForm();
});

registerLink.addEventListener('click', showRegisterForm);

function showRegisterForm() {
    document.getElementById('register-container').classList.remove('hidden');
    loginContainer.classList.add('hidden');
    dashboardContainer.classList.add('hidden');
}

// Login form
const loginForm = document.getElementById('login-form');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const loginLink = document.getElementById('login-link');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;

    // Check if the user exists and credentials match
    const registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    const user = registeredUsers.find(u => u.username === username && u.password === password);

    if (user) {
        // Save the user's information in session storage
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        showDashboard();
    } else {
        alert('Invalid username or password');
    }
});

loginLink.addEventListener('click', showLoginForm);

function showLoginForm() {
    loginContainer.classList.remove('hidden');
    document.getElementById('register-container').classList.add('hidden');
    dashboardContainer.classList.add('hidden');
}

// Dashboard
const userTable = document.getElementById('user-table');
const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('currentUser');
    showLoginForm();
});

// Dashboard action - Refresh button
const refreshBtn = document.getElementById('refresh-btn');

refreshBtn.addEventListener('click', () => {
    const registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    populateUserTable(registeredUsers);
});

// Dashboard action - Delete button
function deleteUser(username) {
    let registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    registeredUsers = registeredUsers.filter(user => user.username !== username);
    sessionStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    populateUserTable(registeredUsers);
}

// Dashboard action - Update button
function updateUser(username) {
    const registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    const user = registeredUsers.find(u => u.username === username);
    openEditModal(user);
}

// Populate the user table
function populateUserTable(users) {
    const userTableBody = userTable.getElementsByTagName('tbody')[0];
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.fullname}</td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
            <td>${user.username}</td>
            <td>
                <button onclick="updateUser('${user.username}')">Update</button>
                <button onclick="deleteUser('${user.username}')">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

function showDashboard() {
    const registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    populateUserTable(registeredUsers);
    loginContainer.classList.add('hidden');
    document.getElementById('register-container').classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
}

const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (currentUser) {
    showDashboard();
} else {
    showLoginForm();
}

// Modal functions
function openEditModal(user) {
    const modal = document.getElementById('editModal');
    const fullnameInput = document.getElementById('edit-fullname');
    const emailInput = document.getElementById('edit-email');
    const mobileInput = document.getElementById('edit-mobile');
    const usernameInput = document.getElementById('edit-username');
    const passwordInput = document.getElementById('edit-password');

    // Populate modal fields with user data
    fullnameInput.value = user.fullname;
    emailInput.value = user.email;
    mobileInput.value = user.mobile;
    usernameInput.value = user.username;
    passwordInput.value = '';

    // Show modal
    modal.style.display = 'block';
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
}

// Close modal when user clicks on close button (X)
document.querySelector('.modal .close').addEventListener('click', closeEditModal);

// Close modal when user clicks anywhere outside of the modal
window.addEventListener('click', (event) => {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
});

// Handle form submission in modal
const editForm = document.getElementById('edit-form');

editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fullname = document.getElementById('edit-fullname').value;
    const email = document.getElementById('edit-email').value;
    const mobile = document.getElementById('edit-mobile').value;
    const username = document.getElementById('edit-username').value;
    const password = document.getElementById('edit-password').value;

    // Update user data
    let registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    const updatedUserIndex = registeredUsers.findIndex(user => user.username === username);
    if (updatedUserIndex !== -1) {
        registeredUsers[updatedUserIndex] = { fullname, email, mobile, username, password };
        sessionStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        populateUserTable(registeredUsers);
        closeEditModal();
    } else {
        console.log('User not found');
    }
});
