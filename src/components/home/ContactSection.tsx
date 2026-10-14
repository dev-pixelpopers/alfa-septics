const FIELDS = [
  { name: "firstName", label: "First Name", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last Name", type: "text", autoComplete: "family-name" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "message", label: "Message", type: "text", autoComplete: "off" },
];

/** Variant42 → Variant43 ("Contact us for") */
export function ContactSection() {
  return (
    <section id="contact" className="flex h-[98.3rem] justify-center bg-snow pt-[15.9rem]">
      <div className="flex h-[71.7rem] w-[160.6rem] flex-col items-center bg-brand-navy pt-[5.8rem]">
        <h2 className="font-display text-[16.5rem] font-black uppercase leading-[0.941] tracking-[-1.155rem] text-white">
          Contact us
        </h2>

        {/* TODO: wire to the callback endpoint once it exists. */}
        <form className="mt-[11rem] grid w-[140rem] grid-cols-2 gap-x-[10.8rem] gap-y-[8.4rem]">
          {FIELDS.map((field) => (
            <label key={field.name} className="flex flex-col">
              <span className="text-[2rem] leading-[0.849] text-frost">{field.label}</span>
              <input
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                className="mt-[0.5rem] h-[3rem] border-b border-white/60 bg-transparent text-[2rem] text-white outline-none transition-colors focus:border-white"
              />
            </label>
          ))}
          <button
            type="submit"
            className="w-fit bg-white px-[4.4rem] py-[2.5rem] text-[2rem] leading-[1.4] tracking-[0.1rem] text-black transition-colors hover:bg-frost"
          >
            Request a Callback →
          </button>
        </form>
      </div>
    </section>
  );
}
