const TLoaderSizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
    xl: "w-24 h-24 border-[8px]",
  } as const
  
  type TLoaderSize = keyof typeof TLoaderSizes
  
  const Loader = ({ size = "md" }: { size?: TLoaderSize }) => {
    const spinnerSize = TLoaderSizes[size] || TLoaderSizes.md
  
    return (
      <div className="flex items-center justify-center">
        <div
          className={`rounded-full ${spinnerSize} border-primary animate-spin`}
          style={{
            borderStyle: "solid",
            borderColor: "#ffdb00",
            borderTopColor: "transparent",
            animationDuration: "0.8s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
          role="status"
          aria-label="Loading"
        />
      </div>
    )
  }
  
  export default Loader
  
  