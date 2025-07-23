import EmailOutlined from '@mui/icons-material/EmailOutlined';
import get from 'lodash/get';
import { ChipButton } from '@/components/ChipButton';
import Icon from '@/components/Icons';
import ProfileCard from '@/components/ProfileCard';
import { useBasic } from '@/components/Vitae';

export const BasicInfo: React.FC = () => {
  const basicInfo = useBasic();
  return (
    <ProfileCard
      header={
        <div className="text-input w-full px-4 py-2 rounded-lg text-center flex flex-col">
          <h3>{get(basicInfo, 'name')}</h3>
          <span className="flex flex-row gap-1 mx-auto text-center mt-1 flex-wrap justify-center">
            <h5 className="">{get(basicInfo, 'label')}</h5>
            <h5>{' | '}</h5>
            <h5 className="">{`${get(basicInfo, 'location.city')} ${get(basicInfo, 'location.postalCode')}`}</h5>
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-input text-justify mb-4 max-sm:mt-12 mt-8">{get(basicInfo, 'summary')}</p>
        <div className="flex flex-row gap-2 flex-wrap">
          {get(basicInfo, 'profiles', []).map(item => {
            return (
              <ChipButton
                key={item.username}
                label={item.username}
                icon={<Icon value={item.network} href={item.url} type="Icon" fontSize={18} />}
                url={item.url}
              />
            );
          })}
          <ChipButton
            label={get(basicInfo, 'email')}
            icon={<EmailOutlined sx={{ fontSize: 18 }} />}
            url={`mailto:${get(basicInfo, 'email')}`}
          />
        </div>
      </div>
    </ProfileCard>
  );
};
