import { Button } from "@/components/ui/button";

const TestHome = () => {
  return (
    <div className="flex content-center justify-items-center justify-center text-center flex-col gap-8 py-20">
      <div className="flex items-center justify-center flex-col p-2 gap-4">
        <div>
          <img src="/Vector.png" alt="image" className="w-12 h-8" />
        </div>
        <div className="font-semibold text-4xl lg:text-5xl">
          Sentence Construction
        </div>
        <p className="text-xl font-normal text-gray-500 px-2 md:px-10 lg:px-56">
          Select the correct words to complete the sentence by arranging the
          provided options in the right order
        </p>
      </div>

      <div className="flex items-center justify-center  flex-col md:flex-row lg:flex-row divide-gray-500 ">
        <div className="flex items-center flex-col justify-center p-7 gap-4">
          <div className="font-medium text-xl text-gray-800">
            Time Per Question
          </div>
          <div className="font-medium text-lg  text-gray-500 ">30sec</div>
        </div>

        {/* Divider */}
        {/* Horizontal divider for mobile */}
        <div className="block md:hidden w-29 h-[1px] bg-gray-300"></div>

        <div className="hidden md:block h-12 w-[1px] bg-gray-300"></div>

        <div className="flex items-center flex-col justify-center p-7 gap-4">
          <div className="font-medium text-xl text-gray-800 ">
            Total Questions
          </div>
          <div className="font-medium text-lg  text-gray-500">10</div>
        </div>

        {/* Divider */}
        {/* Horizontal divider for mobile */}
        <div className="block md:hidden w-29 h-[1px] bg-gray-300"></div>

        <div className="hidden md:block h-12 w-[1px] bg-gray-300"></div>

        <div className="flex items-center flex-col justify-center p-7 gap-4">
          <div className="font-medium text-xl text-gray-800">Coins</div>
          <div className="font-medium text-lg  text-gray-500 flex items-center gap-1 justify-center">
            <span className="">
              <img src="/Ellipse15.png" alt="coin" />
            </span>
            <span>0</span>
          </div>
        </div>
      </div>
      <div className="flex gap-5 items-center justify-center ">
        <Button
          variant="outline"
          className="text-[#453FE1] w-[140px] h-[42px] px-10 py-5 cursor-pointer font-medium text-base hover:bg-[#453FE1] hover:text-white"
        >
          Back
        </Button>
        <Button
          variant="secondary"
          className="bg-[#453FE1] w-[140px]  h-[42px] hover:bg- text-white px-10 py-5 cursor-pointer font-medium text-base hover:bg-white hover:text-[#453FE1] border-2 hover:shadow-2xl"
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default TestHome;
