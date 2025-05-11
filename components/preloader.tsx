export default function Preloader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-dark-color flex justify-center items-center z-[9999] transition-opacity duration-500">
      <div className="text-center">
        <div className="w-[50px] h-[50px] border-3 border-transparent border-t-primary-color rounded-full animate-spin"></div>
        <h2 className="mt-3">Loading...</h2>
      </div>
    </div>
  )
}
