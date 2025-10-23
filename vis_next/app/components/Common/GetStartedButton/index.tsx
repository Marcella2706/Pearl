import Link from 'next/link';

const GetStartedButton = ({ padding }: { padding: string }) => {
  return (
    <Link
      style={{
        padding: padding,
      }}
      href="/"
      className="flex justify-center items-center rounded-full bg-primary text-accent text-base font-semibold hover:bg-destructive transition-colors"
    >
      Get Started
    </Link>
  );
};

export default GetStartedButton;
