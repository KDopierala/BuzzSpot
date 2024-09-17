// components/Dashboard.tsx
import Card from '@/components/Cards';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-6 justify-center p-6">
      <Card title="Zarezerwuj parking" description="Znajdź i zarezerwuj miejsce parkingowe." link="/reserve" />
      <Card title="Aktualne rezerwacje" description="Zobacz swoje obecne rezerwacje." link="/reservations" />
      <Card title="Historia rezerwacji" description="Przeglądaj historię swoich rezerwacji." link="/reservation-history" />
    </div>
  );
};

export default Dashboard;
