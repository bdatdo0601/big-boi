import React from 'react';
import ProfileCard from '../../../components/ProfileCard';
import ContactButton from '../../../components/ContactButton';

interface Contact {
  key: string;
  // Add other properties of contact as needed
}

interface ContactInfoProps {
  className?: string;
  contacts: Contact[];
  animation?: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ contacts = [] }) => {
  return (
    <ProfileCard
      header={<span className="text-2xl text-input">Contact Me!</span>}
    >
      <div className="text-left max-sm:flex min-sm:columns-2 max-sm:flex-wrap gap-2">
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
