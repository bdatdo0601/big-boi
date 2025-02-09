import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import ContactButton, { Contact } from '@/components/ContactButton';


interface ContactInfoProps {
  className?: string;
  contacts: Contact[];
  animation?: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ contacts = [] }) => {
  return (
    <ProfileCard
      header={<span className="text-2xl text-input">Contact Me!</span>}
      cardStyle={{
        maxWidth: 700
      }}
    >
      <div className="flex flex-wrap gap-4 w-full min-lg:justify-start justify-start mx-auto grow">
        {contacts.map(contact => (
          <div key={contact.key}>
            <ContactButton contact={contact} />
          </div>
        ))}
      </div>
    </ProfileCard>
  );
};

export default ContactInfo;
