import { redirect } from "next/navigation";

/**
 * Homepage is temporarily offline while the new Figma-based design is
 * being finalized. Requests to `/` are 307-redirected to the previous
 * production landing (`/sales-mastery`), so no visitor lands on an
 * unfinished page.
 *
 * To bring the homepage back, restore the section imports and the
 * rendered `<HomeHero />, <WegweiserSection />, …` tree that lived
 * here at commit 680339e.
 */
export default function Home() {
  redirect("/sales-mastery");
}
