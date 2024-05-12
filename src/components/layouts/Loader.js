import { ThreeDots } from 'react-loader-spinner'

export default function Loader() {
  return (
    <div className="w-full h-full flex justify-center bg-gray-100">
      <ThreeDots
        visible={true}
        height="120"
        width="160"
        color="#0BC24E"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  )
}
