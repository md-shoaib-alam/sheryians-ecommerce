interface SectionHeadingProps {
  title: string
}

const SectionHeading = ({ title }: SectionHeadingProps) => {
  return (
    <div className="mb-4 md:mb-12 text-left px-2 md:px-0">
      <h2 className="text-2xl sm:text-4xl font-black text-brand-dark uppercase tracking-tight px-2 font-syne whitespace-nowrap inline-block">
        {title}
      </h2>
    </div>
  )
}

export default SectionHeading
