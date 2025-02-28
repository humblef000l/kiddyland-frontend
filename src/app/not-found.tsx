 export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-secondary">
      <h1 className="text-6xl font-bold text-text-primary">404</h1>
      <p className="mt-2 text-lg text-text-secondary">
        Oops! The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="mt-6 rounded-[50] bg-primary px-5 py-2 text-text-primary transition duration-300 ease-in hover:bg-text-secondary"
      >
        Go Home
      </a>
    </div>
  );
}