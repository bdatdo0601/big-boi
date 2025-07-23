import Print from '@mui/icons-material/Print';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PaperResumeRenderer from './PaperResumeRenderer';

export default function PaperResumeDisplay() {
  const ref = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: ref });

  return (
    <div className="overflow-auto flex flex-col mx-auto items-center gap-4 my-2">
      <div>
        <button
          className="bg-primary py-2 px-4 rounded-lg hover:cursor-pointer"
          onClick={() => {
            reactToPrintFn();
          }}
        >
          <Print sx={{}} /> Print Resume
        </button>
      </div>
      <PaperResumeRenderer ref={ref} />
    </div>
  );
}
