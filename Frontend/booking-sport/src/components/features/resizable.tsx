import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function AboutFastFood() {
  return (
    <div className="bg-gradient-to-b from-yellow-400 via-red-500 to-red-700 text-white min-h-screen">
      {/* Header */}
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">Welcome to QTFatsfood</h1>
        <p className="text-lg mt-4">"Delicious bites, fast service, happy smiles!"</p>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg">
        {/* Left Panel: About Us */}
        <ResizablePanel defaultSize={60} className="bg-white text-black">
          <div className="p-6 flex flex-col items-center justify-center h-full">
            <img src="/about.jpg" alt="About Us" className="rounded-lg shadow-lg w-full h-64 object-cover" />
            <h2 className="text-2xl font-semibold mt-6">About Us</h2>
            <p className="mt-4 text-center">
              At QTFastfood, we serve delicious meals made with fresh ingredients, perfect for every occasion. Our mission is to deliver happiness through every bite!
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle />

        {/* Right Panel: Mission and Values */}
        <ResizablePanel defaultSize={40} className="bg-gray-800 text-white">
          <ResizablePanelGroup direction="vertical">
            {/* Mission */}
            <ResizablePanel defaultSize={50} className="bg-gray-700">
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-semibold">Our Mission</h2>
                <p className="mt-4 text-center">
                  Bringing fast, flavorful food to the community with top-notch service and a smile.
                </p>
              </div>
            </ResizablePanel>
            <ResizableHandle />

            {/* Values */}
            <ResizablePanel defaultSize={50} className="bg-gray-900">
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-semibold">Our Values</h2>
                <ul className="mt-4 space-y-2 text-center">
                  <li>- Fresh ingredients, every day.</li>
                  <li>- Quick and friendly service.</li>
                  <li>- Supporting the local community.</li>
                </ul>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Footer with CTA */}
      <footer className="text-center py-8 mt-10 bg-red-600">
        <h2 className="text-2xl font-semibold">Ready to Order?</h2>
        <p className="mt-2">Visit our store or order online for a delicious experience!</p>
        <a href="/menu">
        <button  className="mt-4 px-6 py-3 bg-yellow-500 text-red-800 font-bold rounded-lg shadow-lg hover:bg-yellow-600">
          Go to menu
        </button>
        </a>
      </footer>
    </div>
  );
}
