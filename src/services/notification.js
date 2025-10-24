class NotificationService {
  constructor() {
    this.permission = null;
    this.checkPermission();
  }

  async checkPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    this.permission = Notification.permission;
    return this.permission === 'granted';
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      throw new Error('Notification permission denied');
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  showPerformanceAlert(agentData) {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const { agentId, agentName, summary } = agentData;
    
    const notification = new Notification('Agent Performance Alert', {
      body: `Agent ${agentName} (${agentId}) has crossed performance threshold. ${summary || 'Click for details.'}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `performance-alert-${agentId}`,
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      // Emit custom event for handling in the app
      window.dispatchEvent(new CustomEvent('notificationClick', {
        detail: { agentId, agentName, action: 'view' }
      }));
    };

    // Auto-close after 10 seconds if not interacted with
    setTimeout(() => {
      notification.close();
    }, 10000);

    return notification;
  }

  showGenericNotification(title, body, options = {}) {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }

  getPermissionStatus() {
    return {
      supported: 'Notification' in window,
      permission: this.permission,
      granted: this.permission === 'granted'
    };
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
