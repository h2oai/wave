export const showNotification = async (notificationText: string) => {
  // TODO: Decide on fallback when user's browser does not support Notification API.
  if (!('Notification' in window)) return
  else if (Notification.permission === 'granted') new Notification(notificationText)
  else if (Notification.permission !== 'denied') {
    if (await Notification.requestPermission() === 'granted') new Notification(notificationText)
  }
}