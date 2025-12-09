import Image from "next/image";
import LoginClient from "./comp/LoginClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[url('/images/bg-mob.png')] md:bg-[url('/images/bg.png')] md:bg-cover md:bg-center bg-no-repeat items-center justify-center gap-16 px-6 md:px-20 bg-zinc-50 dark:bg-black">
      
      {/* LEFT TEXT SECTION */}
      <section className="text-center md:text-left max-w-xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold leading-tight">
          Your Document
        </h1>

        <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold mb-6 text-zinc-600 dark:text-zinc-400">
          Wallet
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400">
          Securely store, manage, and access your important documents —
          anywhere, anytime.
        </p>
      </section>

     
      <section className="w-full max-w-sm">
        <LoginClient />
      </section>

    </main>
  );
}
