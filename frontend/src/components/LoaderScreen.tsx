import { Loader } from "lucide-react"



const LoaderScreen = () => {
  return (
     <div className="app-bg h-screen bg-neutral-950">
        <div className="h-full w-full flex justify-center items-center">
          <Loader className="size-12  text-slate-200 animate-spin" />
        </div>
      </div>
  )
}
export default LoaderScreen