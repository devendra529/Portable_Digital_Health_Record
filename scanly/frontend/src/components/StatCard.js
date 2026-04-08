export default function StatCard({ icon: Icon, label, value, color = 'sky', trend }) {
  const colorMap = {
    sky: 'bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400',
    teal: 'bg-teal-100 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
    green: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
    </div>
  );
}
