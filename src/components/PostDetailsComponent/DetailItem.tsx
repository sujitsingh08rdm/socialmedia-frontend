interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="neo-card bg-secondary">
      <p className="text-xs uppercase font-black opacity-70">{label}</p>

      <p className="mt-1 font-semibold break-words">{value}</p>
    </div>
  );
}

export default DetailItem;
