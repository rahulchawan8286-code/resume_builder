import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/Accordion';

export default function FAQ() {
  const faqs = [
    { q: "Is this free for students?", a: "The core platform is free. We offer premium features for advanced AI interview mocks." },
    { q: "Does it support Non-IT placements?", a: "Absolutely! We cover Core ECE companies like Intel, Qualcomm, and Texas Instruments in depth." },
    { q: "How accurate is the AI Prediction?", a: "Our AI Readiness Engine utilizes data from thousands of successful candidates to provide a highly accurate probability score." }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white text-center">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-lg font-medium">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-gray-500 dark:text-gray-400">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}