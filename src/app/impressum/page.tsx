import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Impressum — Selmir Suljkanovic",
};

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <h3>Name</h3>
      <p>SH Wachstumsgesellschaft mbH</p>

      <h3>Adresse</h3>
      <address>
        Zweigertstraße 50
        <br />
        45130 Essen
      </address>

      <h3>E-Mail-Adresse</h3>
      <p>
        <a href="mailto:info@sh-wachstum.de">info@sh-wachstum.de</a>
      </p>

      <h3>Telefon</h3>
      <p>
        <a href="tel:020149869220">0201 49869220</a>
      </p>

      <h3>Verantwortlich für den Inhalt</h3>
      <p>Selmir Suljkanovic</p>

      <h3>Umsatzsteuer-ID</h3>
      <p>DE36 6746 234</p>

      <h3>Geschäftsführender Gesellschafter</h3>
      <p>Selmir Suljkanovic</p>
    </LegalPage>
  );
}
