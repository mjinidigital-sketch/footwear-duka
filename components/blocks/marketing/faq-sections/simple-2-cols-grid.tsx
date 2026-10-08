const faqs = [
  {
    question: "Can I cancel at anytime?",
    answer:
      "Yes, you can cancel anytime no questions are asked while you cancel but we would highly appreciate if you will give us some feedback.",
  },
  {
    question: "My team has credits. How do we use them?",
    answer:
      "Once your team signs up for a subscription plan. This is where we sit down, grab a cup of coffee and dial in the details.",
  },
  {
    question: "How does Acme's pricing work?",
    answer:
      "Our subscriptions are tiered. Understanding the task at hand and ironing out the wrinkles is key.",
  },
  {
    question: "How secure is Acme?",
    answer:
      "Protecting the data you trust to Acme is our first priority. This part is really crucial in keeping the project in line to completion.",
  },
  {
    question: "Do you offer discounts?",
    answer:
      "We've built in discounts at each tier for teams. The time has come to bring those ideas and plans to life.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer refunds. We aim high at being focused on building relationships with our clients and community.",
  },
];

export default function Simple2ColsGrid() {
  return (
    <>
      {/* FAQ */}
      <div className="max-w-[85rem] container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="text-2xl font-bold md:text-3xl md:leading-tight">
            Frequently Asked Questions
          </h2>
        </div>
        {/* End Title */}

        <div className="max-w-5xl mx-auto">
          {/* Grid */}
          <div className="grid sm:grid-cols-2 gap-6 md:gap-12">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
          {/* End Grid */}
        </div>
      </div>
      {/* End FAQ */}
    </>
  );
}
