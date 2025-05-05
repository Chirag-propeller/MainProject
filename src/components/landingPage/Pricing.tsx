import { cn } from "@/lib/utils";

const PricingSection = ()=> {
    return (
      <section id="pricing" className="bg-green-50 text-black py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12 px-2">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {/* Simple, Transparent Pricing */}
            Pricing
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Pay only for what you use — <span className="font-semibold text-black">50¢ per minute</span> of AI voice interaction.
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-2">
          {/* Left Card */}
          <PricingCard
            title="Basic"
            price="$9"
            per="/mo"
            features={[
              "20 mins",
              "3 Concurrent Calls",
              "Voice API & Transcriber",
              "1 Assistant",
              "Basic Integrations",
            ]}
          />
  
          {/* Middle Featured Card */}
          <PricingCard
            featured
            title="Starter"
            price="$19"
            per="/mo"
            features={[
              "50 mins",
              "5 Concurrent Calls",
              "Voice API, LLM, Transcriber",
              "Unlimited Assistants",
              "API & Integrations",
              "Real-Time Booking & Human Transfer",
              "Courses & Community Support",
            ]}
            // footer="50¢ per minute after quota"
          />
  
          {/* Right Card */}
          <PricingCard
            title="Pro"
            price="$39"
            per="/mo"
            features={[
              "150 mins",
              "10 Concurrent Calls",
              "Custom LLMs & Voice Models",
              "Priority Support",
              "Advanced Analytics",
            ]}
          />
        </div>
      </section>
    );
  }
  
  function PricingCard({ title, price, per, features, featured = false, footer }: any) {
    return (
      <div
        className={cn(
          "flex flex-col justify-between rounded-2xl p-6 sm:p-8 shadow-lg border transition-transform duration-300",
          featured
            // ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-purple-500 z-10 scale-105"
            ? "bg-decagon-primary from-decagon-secondary border-2 text-white border-green-500 z-10 scale-105"
            // : "bg-indigo-950 text-gray-200 border-gray-800"
            : "bg-white text-gray-200 "
        )}
      >
        <div
        className={`text-black ${featured ? "text-white" : "text-black"}`}
        >
          <h3 className="text-xl font-semibold mb-2 text-center sm:text-left">{title}</h3>
          <div className="text-4xl font-bold text-center sm:text-left">
            {price}
            <span className="text-base font-medium">{per}</span>
          </div>
          <button
            className={cn(
              "w-full mt-4 mb-6 py-2 px-4 rounded-xl font-semibold transition-all duration-200",
              // featured ? "bg-white text-purple-700 hover:bg-gray-100" : "bg-purple-700 text-white hover:bg-purple-800"
              featured ? "bg-white text-decagon-primary hover:bg-gray-100" : "bg-decagon-primary text-white hover:bg-decagon-primary/90"
            )}
          >
            Subscribe
          </button>
          <ul className="space-y-2 text-sm">
            {features.map((f: string, idx: number) => (
              <li key={idx} className="flex items-start">
                {/* <span className="mr-2 text-green-400">✓</span> */}
                {/* <span className="text-white mr-2">✓</span> */}
                <span className={`text-black mr-2 ${featured ? "text-white" : "text-green-500"}`}>✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        {footer && (
          <p className="text-xs text-gray-300 mt-6 text-center sm:text-left">
            {footer}
          </p>
        )}
      </div>
    );
  }

  export default PricingSection;
  