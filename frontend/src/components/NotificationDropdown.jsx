import api from "../api/axios";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationDropdown({ onClose }) {
  const { notifications, removeNotification } = useNotifications();

  const acceptBid = async (notification) => {
    if (!notification.bidId) {
      alert("Bid ID missing");
      return;
    }

    await api.patch(`/bids/${notification.bidId}/accept`);
    removeNotification(notification._id);
    onClose();
  };

  const rejectBid = async (notification) => {
    if (!notification.bidId) {
      alert("Bid ID missing");
      return;
    }

    await api.patch(`/bids/${notification.bidId}/reject`);
    removeNotification(notification._id);
    onClose();
  };

  return (
    <div className="absolute right-0 top-10 w-80 bg-white border rounded shadow z-50">
      {notifications.length === 0 ? (
        <p className="p-4 text-gray-500">No notifications</p>
      ) : (
        notifications.map((n) => (
          <div key={n._id} className="p-4 border-b">
            <p className="text-sm mb-3">{n.message}</p>

            {n.type === "new_bid" && (
              <div className="flex gap-2">
                <button
                  onClick={() => acceptBid(n)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectBid(n)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
