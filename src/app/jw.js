// sw.js
self.addEventListener('push', function (event) {
    const options = {
      body: event.data.text(),
      icon: 'path-to-your-icon.png',
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    };
  
    event.waitUntil(
      self.registration.showNotification('Your Notification Title', options)
    );
  });
  