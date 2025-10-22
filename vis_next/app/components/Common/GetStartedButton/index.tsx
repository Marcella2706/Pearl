import Link from 'next/link';

const GetStartedButton = ({ padding }: { padding: string }) => {
  return (
    <Link
      style={{
        padding: padding,
      }}
      href="/"
      className="flex justify-center items-center rounded-full bg-accent text-background text-base font-semibold hover:bg-accent-hover transition-colors"
    >
      Get Started
    </Link>
  );
};

export default GetStartedButton;
