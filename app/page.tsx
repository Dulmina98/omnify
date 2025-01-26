import {Landing} from "@/app/home/components/landing";

export default function Home() {
  return (
      <div className={"w-full h-screen flex justify-center relative"}>
          <div
              className={"bg-[url(/assets/images/bg/landing-bg.jpg)] bg-cover bg-no-repeat w-full h-full absolute top-0 left-0 z-0"}/>
          <Landing/>
    </div>
  );
}
