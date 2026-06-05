import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Viyanjan",
  description: "Reach us for reservations, private events, and enquiries.",
};

export default function ContactPage() {
  return <ContactClient />;
}
