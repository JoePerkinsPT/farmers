// Consolidated Messaging System
// Replaces duplicate message display functions across all files

class MessageManager {
    /**
     * Show a message to the user with animation and auto-removal
     * @param {string} message - The message to display
     * @param {string} type - Message type: 'success', 'error', 'info', 'warning'
     * @param {number} duration - How long to show the message (ms)
     * @param {HTMLElement} container - Container to append message to (defaults to body)
     */
    static showMessage(message, type = 'info', duration = 5000, container = null) {
        console.log('MessageManager.showMessage called:', message, type, duration);
        
        // Remove existing messages of the same type
        const existingMessages = document.querySelectorAll(`.message.message-${type}`);
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <span class="message-text">${message}</span>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        console.log('Message element created:', messageElement);
        
        // Add to specified container or body
        const targetContainer = container || document.body;
        targetContainer.appendChild(messageElement);
        console.log('Message element added to container:', targetContainer);
        
        // Show message with animation
        setTimeout(() => {
            messageElement.classList.add('show');
            console.log('Message show class added to:', messageElement);
        }, 10);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                messageElement.classList.remove('show');
                setTimeout(() => {
                    if (messageElement.parentElement) {
                        messageElement.remove();
                    }
                }, 300);
            }, duration);
        }
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     * @param {HTMLElement} container - Container to append to
     */
    static showError(message, container = null) {
        this.showMessage(message, 'error', 5000, container);
    }
    
    /**
     * Show success message
     * @param {string} message - Success message
     * @param {HTMLElement} container - Container to append to
     */
    static showSuccess(message, container = null) {
        this.showMessage(message, 'success', 3000, container);
    }
    
    /**
     * Show warning message
     * @param {string} message - Warning message
     * @param {HTMLElement} container - Container to append to
     */
    static showWarning(message, container = null) {
        this.showMessage(message, 'warning', 4000, container);
    }
    
    /**
     * Show info message
     * @param {string} message - Info message
     * @param {HTMLElement} container - Container to append to
     */
    static showInfo(message, container = null) {
        this.showMessage(message, 'info', 3000, container);
    }
    
    /**
     * Show loading message
     * @param {string} message - Loading message
     * @param {HTMLElement} container - Container to append to
     */
    static showLoading(message = 'Loading...', container = null) {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-message';
        loadingElement.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <span class="loading-text">${message}</span>
            </div>
        `;
        
        const targetContainer = container || document.body;
        targetContainer.appendChild(loadingElement);
        
        return loadingElement;
    }
    
    /**
     * Hide loading message
     * @param {HTMLElement} loadingElement - Loading element to remove
     */
    static hideLoading(loadingElement) {
        if (loadingElement && loadingElement.parentElement) {
            loadingElement.remove();
        }
    }
    
    /**
     * Show notification (for cart, wishlist, etc.)
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     * @param {number} duration - Duration to show
     */
    static showNotification(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-text">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        // Position in top-right corner
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }, duration);
        }
    }
    
    /**
     * Get notification color based on type
     * @param {string} type - Notification type
     * @returns {string} - CSS color value
     */
    static getNotificationColor(type) {
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };
        return colors[type] || colors.info;
    }
    
    /**
     * Show cart notification
     * @param {string} message - Cart message
     */
    static showCartNotification(message) {
        this.showNotification(message, 'success', 2000);
    }
    
    /**
     * Show wishlist notification
     * @param {string} message - Wishlist message
     */
    static showWishlistNotification(message) {
        this.showNotification(message, 'info', 2000);
    }
    
    /**
     * Show login notification
     * @param {string} message - Login message
     */
    static showLoginNotification(message) {
        this.showNotification(message, 'success', 3000);
    }
}

// Make MessageManager globally available
window.MessageManager = MessageManager;

// Add CSS animations for notifications
const notificationStyles = `
<style>
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.notification-close, .message-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: 1rem;
    opacity: 0.7;
}

.notification-close:hover, .message-close:hover {
    opacity: 1;
}

.loading-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2rem;
    border-radius: 8px;
    z-index: 1000;
}

.loading-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
`;

// Inject styles if not already present
if (!document.querySelector('#notification-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'notification-styles';
    styleElement.innerHTML = notificationStyles;
    document.head.appendChild(styleElement);
}

// Make MessageManager globally available
window.MessageManager = MessageManager; 