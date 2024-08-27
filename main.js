document.addEventListener('DOMContentLoaded', function() {
    // Handling form submissions for login
    const loginForm = document.querySelector('form[action="/login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            
            fetch('/login', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Login successful!');
                    window.location.href = '/tracker';  // Redirect to the expense tracker page
                } else {
                    alert('Login failed: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handling form submissions for registration
    const registerForm = document.querySelector('form[action="/register"]');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(registerForm);
            
            fetch('/register', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registration successful! You can now log in.');
                    window.location.href = '/login';  // Redirect to the login page
                } else {
                    alert('Registration failed: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handling form submissions for adding expenses
    const addExpenseForm = document.querySelector('form[action="/add-expense"]');
    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(addExpenseForm);
            
            fetch('/add-expense', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Expense added successfully!');
                    location.reload();  // Reload the page to show the new expense
                } else {
                    alert('Failed to add expense: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Placeholder for updating expenses
    // You would create a similar event listener for forms used to update expenses
    const updateExpenseForm = document.querySelector('form[action="/update-expense"]');
    if (updateExpenseForm) {
        updateExpenseForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(updateExpenseForm);
            
            fetch('/update-expense', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Expense updated successfully!');
                    location.reload();  // Reload the page to reflect the changes
                } else {
                    alert('Failed to update expense: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Placeholder for deleting expenses
    // You would create a similar event listener for forms used to delete expenses
    const deleteExpenseForm = document.querySelector('form[action="/delete-expense"]');
    if (deleteExpenseForm) {
        deleteExpenseForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(deleteExpenseForm);
            
            fetch('/delete-expense', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Expense deleted successfully!');
                    location.reload();  // Reload the page to reflect the deletion
                } else {
                    alert('Failed to delete expense: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});
