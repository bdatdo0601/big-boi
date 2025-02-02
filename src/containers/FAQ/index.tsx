import ProfileCard from '@/components/ProfileCard';
import { useFAQ } from '@/components/Vitae';
import withResumeProvider from '@/components/Vitae/withResumeProvider';
import { groupBy } from 'lodash';
import { useMemo } from 'react';

const FAQ = () => {
  const faqData = useFAQ();

  const groupedFAQByCategory = useMemo(() => groupBy(faqData, 'category'), [faqData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <div className="space-y-8">
        {Object.keys(groupedFAQByCategory).map((category) => (
          <ProfileCard
            key={category}
            header={<h2 className="text-2xl font-semibold text-input">{category}</h2>}
          >
            <div className="flex flex-col gap-4 my-2">
              {groupedFAQByCategory[category].map((item, index) => (
                <div key={index} className="border-b border-card-foreground pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-bold mb-2">{item.question}</h3>
                  <p className="text-input pl-4 border-l-4 border-input italic">{item.answer}</p>
                </div>
              ))}
            </div>
          </ProfileCard>
        ))}
      </div>
    </div>
  );
};

export default withResumeProvider(FAQ);
