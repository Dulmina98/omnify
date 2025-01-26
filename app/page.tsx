import {Landing} from "@/app/home/components/landing";
import {WhyOmnify} from "@/app/home/components/why-omnify";

export default function Home() {
  return (
      <div className={"w-full min-h-screen relative overflow-visible flex flex-col items-center"}>

          <Landing/>
          <WhyOmnify/>
          <div
              className={"bg-[url(/assets/images/bg/landing-bg.jpg)] bg-cover bg-no-repeat w-full h-full absolute top-0 left-0 z-0"}/>
      </div>
  );
}
