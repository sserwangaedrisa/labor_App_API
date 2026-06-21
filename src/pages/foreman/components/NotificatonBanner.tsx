import React from "react";
import Icon from "../../../components/ui/AppIconl";
import Button from "../../../components/ui/Button";
import type {
  NotificationType,
  NotificationBannerProps,
  NotificationStyle,
} from "../../../types/SharedTypes";

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notifications,
  onDismiss,
  onViewAll,
}) => {
  if (!notifications || notifications.length === 0) return null;

  const latestNotification = notifications[0];

  const getNotificationStyle = (type: NotificationType): NotificationStyle => {
    const styles: Record<NotificationType, NotificationStyle> = {
      info: {
        bg: "bg-primary/10",
        border: "border-primary/20",
        icon: "Info",
        iconColor: "var(--color-primary)",
      },
      warning: {
        bg: "bg-warning/10",
        border: "border-warning/20",
        icon: "AlertTriangle",
        iconColor: "var(--color-warning)",
      },
      success: {
        bg: "bg-success/10",
        border: "border-success/20",
        icon: "CheckCircle",
        iconColor: "var(--color-success)",
      },
    };

    return styles[type] || styles.info;
  };

  const style = getNotificationStyle(latestNotification.type);

  return (
    <div
      className={`${style.bg} border ${style.border} rounded-xl p-4 mb-4 md:p-6 md:mb-6`}
    >
      <div className="flex items-start gap-3">
        <Icon
          key="style"
          name="Info"
          size={20}
          color={style.iconColor}
          className="flex-shrink-0 mt-0.5 md:w-6 md:h-6"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm mb-1 md:text-base">
                {latestNotification.title}
              </h4>
              <p className="text-xs text-muted-foreground md:text-sm">
                {latestNotification.message}
              </p>
            </div>

            <button
              onClick={() => onDismiss(latestNotification.id)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-background/50 transition-smooth flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <Icon key="x" name="X" size={16} />
            </button>
          </div>

          {notifications.length > 1 && (
            <Button onClick={onViewAll} className="mt-2">
              View all {notifications.length} notifications
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;
