// components/Card.tsx
import Link from 'next/link';

interface CardProps {
  title: string;
  description: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, description, link }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-64 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{description}</p>
      <Link className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors" href={link}>
        Przejdź
      </Link>
    </div>
  );
};

export default Card;
