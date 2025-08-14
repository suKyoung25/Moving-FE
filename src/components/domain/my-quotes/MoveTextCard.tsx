export default function MoveTextCard({ text }: { text: string }) {
   return (
      <div className="bg-bg-400 px w-fit rounded-sm px-1.5 py-0.5 lg:py-1">
         <span className="text-14-medium lg:text-18-medium text-gray-400">
            {text}
         </span>
      </div>
   );
}
