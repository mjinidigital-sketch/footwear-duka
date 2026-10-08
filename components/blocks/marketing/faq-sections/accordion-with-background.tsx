import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access to the service until the end of your billing period.",
  },
  {
    question: "How do I access premium features?",
    answer:
      "Premium features are automatically available once you subscribe to our Pro or Enterprise plans. You can access them from your login immediately after payment is processed.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes, we offer a 14-day free trial on all our plans. No credit card is required to start your trial, and you can upgrade or cancel at any time.",
  },
  {
    question: "How does the team billing work?",
    answer:
      "Team billing is based on the number of seats you need. Each team member counts as one seat, and you can add or remove seats as your team size changes.",
  },
  {
    question: "Is there a discount for annual billing?",
    answer:
      "Yes, we offer a 20% discount when you choose annual billing instead of monthly. This discount is automatically applied at checkout.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual enterprise plans.",
  },
];

export default function AccordionWithBackground() {
  return (
    <div className="max-w-[85rem] bg-muted/50 container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32">
      <div className="rounded-2xl">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold md:text-3xl md:leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Find answers to the most common questions about our service
          </p>
        </div>
        {/* End Title */}

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={faq.question}
                className="border rounded-lg px-6 bg-background shadow-sm"
              >
                <AccordionTrigger className="py-4 text-lg font-medium">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-primary hidden sm:block" />
                    <span className="text-start mr-3">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                  <div className="flex gap-3">
                    <Check className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                    <p>{faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
