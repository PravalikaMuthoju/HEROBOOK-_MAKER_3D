document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const alertMessage = document.getElementById('alert-message');
    const loginButton = document.querySelector('.login-button');
    
    // Image Upload Elements
    const avatarUpload = document.getElementById('avatar-upload');
    const uploadLabel = document.getElementById('upload-label');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const deleteImageBtn = document.getElementById('delete-image-btn');

    if (!loginForm || !alertMessage || !loginButton || !avatarUpload || !imagePreviewContainer || !imagePreview || !deleteImageBtn || !uploadLabel) {
        console.error('One or more required elements are missing from the DOM.');
        return;
    }

    // --- Image Upload Logic ---
    avatarUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Basic file type validation
            if (!file.type.startsWith('image/')){
                showAlert('Please select an image file.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
                uploadLabel.style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    deleteImageBtn.addEventListener('click', () => {
        avatarUpload.value = null; // Clear the file input
        imagePreview.src = '#';
        imagePreviewContainer.style.display = 'none';
        uploadLabel.style.display = 'block';
    });
    
    // --- Form Submission Logic ---
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = loginForm.email.value.trim();
        const password = loginForm.password.value.trim();

        hideAlert();

        if (!email || !password) {
            showAlert('Please fill in both email and password.', 'error');
            return;
        }

        loginButton.disabled = true;
        const buttonSpan = loginButton.querySelector('span');
        buttonSpan.textContent = 'Logging In...';

        // Simulate an API call
        setTimeout(() => {
            // Mock success
            showAlert('Login successful! Taking you to the app...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        }, 1500);
    });

    function showAlert(message, type) {
        alertMessage.textContent = message;
        alertMessage.className = `alert ${type}`; // 'success' or 'error'
    }

    function hideAlert() {
        alertMessage.textContent = '';
        alertMessage.className = 'alert';
    }
});
