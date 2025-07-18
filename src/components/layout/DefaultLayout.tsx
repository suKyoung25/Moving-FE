export default function DefaultLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="px-6 py-6 md:px-16 md:py-8 lg:mx-auto lg:max-w-350 lg:px-0">
         {children}
      </div>
   );
}
