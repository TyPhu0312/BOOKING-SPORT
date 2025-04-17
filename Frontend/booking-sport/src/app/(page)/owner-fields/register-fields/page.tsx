import React from 'react'
import FormLayout from "@/components/features/formLayout"
const RegisterField = () => {
    return (
        <div className="min-h-screen max-w-screen h-auto flex justify-start bg-gray-50 px-4 pt-10">
          <div className="bg-amber-50 rounded-xl h-fit shadow-lg p-8 w-full max-w-screen md:max-w-[50vw] border-black">
            <h1 className="text-2xl font-bold mb-6 text-center">Thông tin của sân</h1>
            <FormLayout/>
          </div>
        </div>
      )
}

export default RegisterField