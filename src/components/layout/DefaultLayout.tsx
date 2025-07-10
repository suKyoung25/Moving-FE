export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-2.5 md:px-16 md:py-8 lg:px-0 lg:max-w-[1400px] lg:mx-auto">
      {children}
    </div>
  );
}
