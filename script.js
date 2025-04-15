// Sample college data for suggestions
const colleges = [
    "Vivekanand Education Society's Institute of Technology (VESIT)",
    "Vivekanand Education Society's Institute of Management Studies and Research (VESIM)",
    "Vivekanand Education Society's College of Pharmacy (VESCOP)",
    "Vivekanand Education Society's College of Arts, Science and Commerce (VESCOASC)",
    "Vivekanand Education Society's College of Law (VESCOL)",
    "Vivekanand Education Society's College of Architecture (VESCOA)",
    "Vivekanand Education Society's College of Hotel Management (VESCOHM)",
    "Harvard University",
    "Stanford University",
    "Massachusetts Institute of Technology",
    "University of California, Berkeley",
    "University of Oxford",
    "University of Cambridge",
    "California Institute of Technology",
    "Princeton University",
    "Yale University",
    "Columbia University",
    "University of Chicago",
    "Imperial College London",
    "ETH Zurich",
    "University of Toronto",
    "University of Tokyo",
    "National University of Singapore",
    "Peking University",
    "Tsinghua University",
    "University of Melbourne",
    "University of Sydney"
];

// Store existing usernames (in a real application, this would come from a database)
const existingUsernames = ['user1', 'user2', 'admin'];

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const collegeInput = document.getElementById('college');
    const suggestionsDiv = document.getElementById('collegeSuggestions');
    const messageDiv = document.getElementById('registrationMessage');

    // College suggestions functionality
    collegeInput.addEventListener('input', function() {
        const input = this.value.toLowerCase();
        if (input.length < 2) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        const filteredColleges = colleges.filter(college => 
            college.toLowerCase().includes(input)
        );

        if (filteredColleges.length > 0) {
            suggestionsDiv.innerHTML = filteredColleges
                .map(college => `<div>${college}</div>`)
                .join('');
            suggestionsDiv.style.display = 'block';
        } else {
            suggestionsDiv.style.display = 'none';
        }
    });

    // Handle college suggestion selection
    suggestionsDiv.addEventListener('click', function(e) {
        if (e.target.tagName === 'DIV') {
            collegeInput.value = e.target.textContent;
            suggestionsDiv.style.display = 'none';
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== collegeInput) {
            suggestionsDiv.style.display = 'none';
        }
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        messageDiv.className = 'message';
        messageDiv.textContent = '';
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const username = document.getElementById('username').value.trim();
        const college = document.getElementById('college').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate form
        let isValid = true;

        // Name validation
        if (name === '') {
            document.getElementById('nameError').textContent = 'Name is required';
            isValid = false;
        } else {
            document.getElementById('nameError').textContent = '';
        }

        // College validation
        if (college === '') {
            document.getElementById('collegeError').textContent = 'College is required';
            isValid = false;
        } else {
            document.getElementById('collegeError').textContent = '';
        }

        // Password validation
        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
            isValid = false;
        } else {
            document.getElementById('confirmPasswordError').textContent = '';
        }

        if (isValid) {
            // Create request data
            const data = {
                name,
                username,
                college,
                password
            };

            // Create XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:3000/register', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function() {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (xhr.status === 200 && response.success) {
                        messageDiv.className = 'message success';
                        messageDiv.textContent = response.message;
                        form.reset();
                    } else {
                        messageDiv.className = 'message error';
                        messageDiv.textContent = response.message || 'Registration failed. Please try again.';
                    }
                } catch (error) {
                    messageDiv.className = 'message error';
                    messageDiv.textContent = 'Error processing response. Please try again.';
                }
            };

            xhr.onerror = function() {
                messageDiv.className = 'message error';
                messageDiv.textContent = 'An error occurred. Please try again.';
            };

            // Send the request
            xhr.send(JSON.stringify(data));
        }
    });
}); 