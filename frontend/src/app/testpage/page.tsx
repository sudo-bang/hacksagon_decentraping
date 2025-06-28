import { EtheralShadow } from "@/components/etheral-shadow";

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <EtheralShadow
      color="rgba(128, 128, 128, 1)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
         />
    </div>
  );
};

export default DemoOne ;
