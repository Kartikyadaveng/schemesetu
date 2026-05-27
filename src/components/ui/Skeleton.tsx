// ============================================================
// SchemeSetu - Skeleton Component
// Loading placeholder shimmer animations
// ============================================================

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  className = '',
  rounded = 'xl',
}: SkeletonProps) {
  return (
    <div
      className={`
        ${width} ${height} rounded-${rounded}
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
        bg-[length:200%_100%]
        animate-[shimmer_1.5s_infinite]
        ${className}
      `}
    />
  );
}

// Skeleton for scheme cards
export function SchemeCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <Skeleton width="w-12" height="h-12" rounded="2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton width="w-3/4" height="h-4" />
          <Skeleton width="w-1/2" height="h-3" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Skeleton height="h-3" />
        <Skeleton width="w-4/5" height="h-3" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton width="w-20" height="h-7" rounded="full" />
        <Skeleton width="w-20" height="h-7" rounded="full" />
      </div>
    </div>
  );
}

// Skeleton for category cards
export function CategorySkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2">
      <Skeleton width="w-12" height="h-12" rounded="2xl" />
      <Skeleton width="w-14" height="h-3" />
    </div>
  );
}

// Skeleton for notification items
export function NotificationSkeleton() {
  return (
    <div className="flex gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
      <Skeleton width="w-10" height="h-10" rounded="full" />
      <div className="flex-1 space-y-2">
        <Skeleton width="w-3/4" height="h-4" />
        <Skeleton height="h-3" />
        <Skeleton width="w-1/3" height="h-3" />
      </div>
    </div>
  );
}
