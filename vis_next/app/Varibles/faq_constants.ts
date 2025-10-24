type FAQItem = {
  question: string;
  answer: string;
};

export const desktopHeaderPhrase = ['Frequently asked', 'questions'];
export const mobileHeaderPhrase = ['Frequently', 'asked', 'questions'];
export const animate = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  open: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 1, delay: 0.1 * i, ease: [0.33, 1, 0.68, 1] },
  }),
};

export const faqData: FAQItem[] = [
  {
    question: 'How do I create an account with Jivika?',
    answer:
      'Sign up with your email or phone number, verify using the one-time code, and complete a brief health profile. Accounts are optional for anonymous queries but required for saving history and personalized care.',
  },
  {
    question: 'Can I upload images (photos, reports, scans) to the chatbot?',
    answer:
      "Yes — you can upload images (photos of symptoms, lab reports, or scans). The system runs an image-check model to classify and extract relevant information, then provides context-aware suggestions. Uploaded images are processed securely and are not shared with third parties.",
  },
  {
    question: 'What types of images are supported and how are they checked?',
    answer:
      'Common image formats (JPEG, PNG, PDF scans) are supported. An internal model first validates the file type and quality, then runs domain-specific analysis (e.g., skin lesion, wound photo, or lab report text extraction) before returning suggestions or routing to a clinician.',
  },
  {
    question: 'How do you protect my medical data and images?',
    answer:
      'All data in transit and at rest is encrypted. Images and messages are processed on secure servers with strict access controls. By default, temporary artifacts used for inference are deleted after processing; persistent storage requires explicit user consent. No data leaks — we follow industry-standard security practices.',
  },
  {
    question: 'How accurate are the AI suggestions and what are the limitations?',
    answer:
      'The AI provides evidence-based suggestions and triage guidance but is not a substitute for a licensed physician. Accuracy depends on input quality (clear images, complete symptoms). For urgent or ambiguous cases, the system will recommend speaking to a human clinician or emergency services.',
  },
  {
    question: 'How long is my data retained and can I delete it?',
    answer:
      'You control retention. Default retention is short (e.g., temporary for inference) unless you opt into history for personalization. You can request deletion of your account and all associated data anytime via the app settings or by contacting support; deletion requests are processed promptly and logged for compliance.',
  },
];
