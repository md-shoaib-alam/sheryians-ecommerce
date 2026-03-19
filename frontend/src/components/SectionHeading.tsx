interface SectionHeadingProps {
  title: string
}

const SectionHeading = ({ title }: SectionHeadingProps) => {
  return (
    <div className="mb-4 md:mb-12 text-left px-2 md:px-0">
      <h2 className="text-xl sm:text-3xl font-black text-brand-dark uppercase tracking-tight px-2 whitespace-nowrap inline-block">
        {title}
      </h2>
    </div>
  )
}

export default SectionHeading
