import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politika privatnosti - Slatko i fino',
  description: 'Pročitajte našu politiku privatnosti i kako koristimo kolačiće.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Politika privatnosti</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          Ovdje ide vaš detaljan tekst o politici privatnosti. Objasnite koje podatke prikupljate, zašto ih prikupljate i kako ih koristite.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Kolačići (Cookies)</h2>
        <p>
          Naša web stranica koristi kolačiće kako bi poboljšala vaše korisničko iskustvo. U nastavku je objašnjenje vrsta kolačića koje koristimo.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Strogo neophodni kolačići</h3>
        <p>
          Ovi su kolačići ključni za omogućavanje kretanja po web stranici i korištenje njezinih značajki. Bez ovih kolačića, usluge koje ste zatražili ne mogu biti pružene.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Analitički kolačići</h3>
        <p>
          Ovi kolačići prikupljaju informacije o tome kako posjetitelji koriste web stranicu, na primjer, koje stranice posjetitelji najčešće posjećuju. Te podatke koristimo za poboljšanje naše web stranice i usluga. Svi podaci koje ovi kolačići prikupljaju su agregirani i stoga anonimni.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Vaša prava</h2>
        <p>
          Imate pravo zatražiti pristup, ispravak ili brisanje vaših osobnih podataka. Također možete u bilo kojem trenutku povući svoj pristanak za korištenje kolačića.
        </p>
      </div>
    </div>
  );
}
