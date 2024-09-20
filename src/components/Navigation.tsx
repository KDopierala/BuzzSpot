import Link from 'next/link';

const NavMenu = () => {
  return (
    <nav className="flex space-x-6">
      <Link href="/">
        Home
      </Link>
      <Link href="/reserve">
        Reserve
      </Link>
      <Link href="/reservations">
        Reservations
      </Link>
      <Link href="/history">
        History
      </Link>
    </nav>
  );
};

export default NavMenu;
