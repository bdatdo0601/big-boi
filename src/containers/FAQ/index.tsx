import { groupBy } from 'lodash';
import { useMemo } from 'react';
import ProfileCard from '@/components/ProfileCard';
import { useFAQ } from '@/components/Vitae';
import withResumeProvider from '@/components/Vitae/withResumeProvider';

const FAQ = () => {
  const faqData = useFAQ();

  const groupedFAQByCategory = useMemo(() => groupBy(faqData, 'category'), [faqData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-12 text-center">Frequently Asked Questions</h1>
      <div className="space-y-8">
        {Object.keys(groupedFAQByCategory).map(category => (
          <ProfileCard key={category} header={<h3>{category}</h3>}>
            <div className="flex flex-col gap-4 my-2">
              {groupedFAQByCategory[category].map((item, index) => (
                <div key={index} className="border-b border-card-foreground pb-4 last:border-b-0 last:pb-0">
                  <h5 className="mb-2">{item.question}</h5>
                  <blockquote className="text-lg">{item.answer}</blockquote>
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
