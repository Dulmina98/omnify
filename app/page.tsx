import {Landing} from "@/app/home/components/landing";
import {WhyOmnify} from "@/app/home/components/why-omnify";
import {Steps} from "@/app/home/components/steps";
import {WhyLoveOmnify} from "@/app/home/components/why-love-omnify";
import {Contact} from "@/app/home/components/contact";

export default function Home() {
  return (
      <div className={"w-full min-h-screen relative overflow-visible flex flex-col items-center"}>

          <Landing/>
          <WhyOmnify/>
          <Steps/>
          <div className={"relative w-full flex justify-center z-10"}>
              <WhyLoveOmnify/>
              <div
                  className={"bg-[url(/assets/images/bg/love-bg.jpg)] bg-cover bg-no-repeat w-full h-full absolute top-0 left-0 z-0"}/>
          </div>
          <Contact/>
          {/*<div
              className={"bg-[url(/assets/images/bg/landing-bg.jpg)] bg-cover bg-no-repeat w-full h-full absolute top-0 left-0 z-0"}/>*/}
      </div>
  );
}
