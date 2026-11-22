import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CorridorIndexContent from "@/components/CorridorIndexContent";
import { cities, corridors } from "@/data/cities";
import { socialMetadata } from "@/lib/site";
import { company } from "@/data/company";

const title = "Packers & Movers City Routes";
const description =
  "Intercity household and office moving across Bengaluru, Hyderabad, Chennai, Mumbai, Pune, Delhi NCR, Kochi and Coimbatore — transit times and free surveys on every lane.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/packers-movers" }),
};

export default function CorridorIndexPage() {
  return (
    <>
      <Navbar />
      <CorridorIndexContent
        cities={cities}
        corridors={corridors}
        phone={company.phone}
        phoneE164={company.phoneE164}
      />
      <Footer />
    </>
  );
}
