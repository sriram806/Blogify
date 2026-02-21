import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="w-full bg-linear-to-b from-white via-gray-50 to-white">
      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Contact <span className="text-black">Blogify</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          Have a question, collaboration idea, or feedback? We’d love to hear
          from you.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pb-16">
        <div className="grid lg:grid-cols-5 gap-8 md:gap-10">
          <div className="lg:col-span-2 space-y-4">
            <InfoCard
              icon={<FaEnvelope />}
              title="Email"
              value="hello@blogify.com"
              hint="Best for general support and partnership queries"
            />

            <InfoCard
              icon={<FaPhoneAlt />}
              title="Phone"
              value="+1 (555) 123-4567"
              hint="Mon - Fri, 9:00 AM to 6:00 PM"
            />

            <InfoCard
              icon={<FaMapMarkerAlt />}
              title="Office"
              value="Hyderabad, India"
              hint="Remote-first team with global contributors"
            />
          </div>

          <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Send us a message
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill out the form and our team will get back to you shortly.
            </p>

            <form className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" id="name" type="text" placeholder="John Doe" />
                <Field label="Email address" id="email" type="email" placeholder="john@example.com" />
              </div>

              <Field label="Subject" id="subject" type="text" placeholder="How can we help?" />

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Send Message
              </button>
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
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
      <div className="text-black text-lg">{icon}</div>
      <h3 className="mt-3 text-sm uppercase tracking-[0.12em] text-gray-500">{title}</h3>
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
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-black"
      />
    </div>
  );
}
