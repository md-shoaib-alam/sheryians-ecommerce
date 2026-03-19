interface SectionHeadingProps {
  title: string
}

const SectionHeading = ({ title }: SectionHeadingProps) => {
  return (
    <div className="mb-4 md:mb-12 text-left px-2 md:px-0">
      <h2 className="text-xl sm:text-7xl font-black text-white uppercase italic tracking-tighter transform -skew-x-12 inline-block relative px-2 font-syne whitespace-nowrap">
        {title}
        <div className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-0.5 md:h-1 bg-red-600 shadow-[0_4px_10px_rgba(255,0,0,0.5)]"></div>
      </h2>
    </div>
  )
}

export default SectionHeading
