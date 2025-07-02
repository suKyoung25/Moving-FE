export default function SectionTitle({title} : {title : string}) {
    return (
        <h2
            className="
                text-28-semibold mb-10 text-center
                md:text-[44px] md:font-bold
                lg:mb-12
            "
        >
            {title}
        </h2>
    )
}