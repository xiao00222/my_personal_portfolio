import { Mail, Phone, MapPin } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "acfarhan123@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+92 3350460061",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Islamabad, Pakistan",
    href: undefined,
  },
];

export const Contact = () => {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Let's build{" "}
            <span className="font-serif italic font-normal text-white">
              something great.
            </span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            Have an opportunity or project in mind? Reach out directly — I'm
            happy to talk.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in animation-delay-300">
          <div className="glass rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6">
              Contact Information
            </h3>
            <div className="space-y-4">
              {contactInfo.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="font-medium">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Availability Card */}
          <div className="glass rounded-3xl p-8 border border-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">Currently Available</span>
            </div>
            <p className="text-muted-foreground text-sm">
              I'm currently open to new opportunities — full-time roles or
              freelance work. Let's talk!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};