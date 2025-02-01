export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen justify-center lg:px-0 px-4">
      <main className="w-full max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
