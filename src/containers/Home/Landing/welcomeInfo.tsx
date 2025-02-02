import { useRef } from 'react';
import ProfileCard from '../../../components/ProfileCard';
import { Download, QuestionAnswer } from '@mui/icons-material';
import PaperResumeRenderer from '@/containers/PaperResume/PaperResumeRenderer';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router';

export default function WelcomeInfo({ bio }: { bio: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: ref });
  const navigate = useNavigate();

  return (
    <ProfileCard
      header={<span className="text-2xl text-input">Hello There!</span>}
      contentStyle={{
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div className="flex flex-col items-center">
        <div className="mx-4 my-2 text-left">
          {bio.map(item => (
            <p key={item} className="text-input">
              {item}
            </p>
          ))}
        </div>
        <div className='flex flex-wrap gap-2 items-center'>
          <button
            className="hover:cursor-pointer rounded-xl text-input shadow-lg bg-secondary px-3 py-2 mt-4"
            onClick={() => {
              reactToPrintFn();
            }}
          >
            <Download sx={{}} /> My Latest Resume
          </button>

          <button className="hover:cursor-pointer rounded-xl text-input shadow-lg bg-secondary px-3 py-2 mt-4" onClick={() => { navigate('/faq') }}>
            <QuestionAnswer sx={{}} /> My FAQ
          </button>
        </div>
      </div>
      <div className="hidden">
        <PaperResumeRenderer ref={ref} />
      </div>
    </ProfileCard>
  );
}