

export default function Contact() {
  return (
    <div name='contact'  className="flex flex-col items-center gap-4 px-4 my-12">
      <p className="text-4xl font-medium text-green-700">Contact</p>
      <div className="grid grid-cols-1 md:grid-cols-2 w-3/5 gap-4">
        <div className=" flex flex-col bg-gray-100 rounded-lg shadow-md shadow-gray-200">
            <p className=" text-lg my-2 p-4">
            Visit usto experience culinary bliss like never before. 
            For inquiries, reservations, or delivery orders, feel free to
             reach out to us. We can't wait to welcome you to Savory
              Delights and create unforgettable memories together.
            </p>
            <p className=" text-lg my-2 p-4">
            Whether you choose to dine in or opt for delivery, prepare 
            to be captivated by flavors that linger long after the last 
            bite. Your culinary adventure awaits!
            </p>
        </div>
        <div className="flex flex-col p-8 justify-center items-center bg-gray-100 rounded-lg
                        shadow-md shadow-gray-200">
            <p className="text-lg font-medium text-green-700 my-2">1234 St. 2nd Ave</p>
            <p className="text-lg font-medium text-green-700 my-2">56789 Shoreline</p>
            <p className="text-lg font-medium text-green-700 my-2">WA USA</p>
            <p className="text-lg font-medium text-green-700 my-2">+1 (123) 456 7890</p>

        </div>
      </div>
    </div>
  )
}
