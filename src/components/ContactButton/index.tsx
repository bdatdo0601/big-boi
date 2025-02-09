import Icon from "../Icons";

interface IconInput {
  type: 'Icon' | 'Image';
  value: string;
}

export interface Contact {
  key: string;
  name: string;
  icon: IconInput;
  value: string;
  link: string;
}

interface ContactButtonProps {
  contact: Contact;
}
export default function ContactButton({ contact }: ContactButtonProps) {
  return (
    <button className='bg-secondary px-4 py-2 hover:bg-primary hover:cursor-pointer shadow-lg rounded-lg flex flex-nowrap gap-2 items-center my-2' onClick={(e) => {
      e.preventDefault();
      window.open(contact.link, '_blank');
    }}>
      {contact.icon.type === 'Icon' ? (
        <Icon value={contact.icon.value} type="Icon" href="#" />
      ) : (
        <img src={contact.icon.value} alt={contact.key} />
      )}
      <span>{contact.value}</span>
    </button>
  );
}

ContactButton.defaultProps = {
  contact: {
    key: 'UnknwonKey',
    name: 'Unknown',
    icon: {
      type: 'Icon',
      value: 'Save',
    },
    value: 'unknown',
    link: 'unknown',
  },
};
