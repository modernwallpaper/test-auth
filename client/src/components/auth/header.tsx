export const Header = ({ label }: { label: string }) => {
  return(
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight lg:text-4xl">
        Tkdathletics
      </h1>
      <p className="text-muted-foreground text-sm">
        {label}
      </p>
    </div>
  )
}
