// components/DriverList.jsx
import DriverCard from './DriverCard';

export default function DriverList() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <DriverCard key={i} />
      ))}
    </div>
  );
}
