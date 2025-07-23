export default function GuestLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="px-6 py-6 md:mx-auto md:w-82 md:px-0 md:py-8 lg:w-160">
         {children}
      </div>
   );
}
