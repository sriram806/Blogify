import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="w-full bg-gradient-to-b from-white via-gray-50 to-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 mb-4">
          Contact
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Let’s talk about your next idea
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          Questions, feedback, or partnerships — our team is here to help you
          build and grow with Blogify.
        </p>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pb-20">
        <div className="grid lg:grid-cols-5 gap-8 md:gap-12">

          {/* CONTACT INFO */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24 h-fit">
            <InfoCard
              icon={<FaEnvelope />}
              title="Email"
              value="hello@blogify.com"
              hint="Best for support & partnerships"
            />
            <InfoCard
              icon={<FaPhoneAlt />}
              title="Phone"
              value="+1 (555) 123-4567"
              hint="Mon – Fri · 9 AM – 6 PM"
            />
            <InfoCard
              icon={<FaMapMarkerAlt />}
              title="Office"
              value="Hyderabad, India"
              hint="Remote-first global team"
            />
          </div>

          {/* FORM */}
          <div className="lg:col-span-3 rounded-3xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 md:p-10">

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Send a message
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We usually respond within 24 hours.
            </p>

            <form className="mt-6 space-y-5">

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" id="name" type="text" placeholder="John Doe" />
                <Field label="Email address" id="email" type="email" placeholder="john@example.com" />
              </div>

              <Field label="Subject" id="subject" type="text" placeholder="Project inquiry" />

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Tell us about your idea or question..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-full bg-black px-7 py-3 text-sm font-medium text-white hover:bg-gray-800 transition shadow-sm"
                >
                  Send Message
                </button>

                <p className="text-xs text-gray-500">
                  Your information is kept private.
                </p>
              </div>

            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  value,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 hover:shadow-md transition">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-black">
        {icon}
      </div>
      <h3 className="mt-3 text-xs uppercase tracking-[0.14em] text-gray-500">
        {title}
      </h3>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-600">{hint}</p>
    </div>
  );
}

function Field({
  label,
  id,
  type,
  placeholder,
}: {
  label: string;
  id: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition"
      />
    </div>
  );
}