import { useSpring, animated } from '@react-spring/web';
interface ProfileCardProps {
  cardStyle?: React.CSSProperties;
  headerWrapperStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  children?: React.ReactNode;
  contentStyle?: React.CSSProperties;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  footerStyle?: React.CSSProperties;
}

const AnimatedDiv = animated.div as any;

function ProfileCard({
  cardStyle = {},
  headerWrapperStyle = {},
  headerStyle = {},
  children = null,
  contentStyle = {},
  header = null,
  footer = null,
  footerStyle = {},
}: ProfileCardProps) {
  const cardAnimation = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: { duration: 500 },
  });

  const headerAnimation = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: { duration: 500 },
    delay: 200,
  });

  const contentAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
    delay: 400,
  });

  const footerAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
    delay: 600,
  });

  return (
    <AnimatedDiv
      style={{
        ...cardAnimation,
        ...cardStyle,
      }}
      className="relative overflow-visible rounded-lg bg-card w-full"
    >
      <div className="inline-block w-full p-0 mb-3 overflow-visible text-input">
        <div
          className="z-10 overflow-visible mb-6"
          style={headerWrapperStyle}
        >
          <AnimatedDiv
            style={{
              ...headerAnimation,
              ...headerStyle,
            }}
            className="absolute w-[84%] ml-[8%] mr-[8%] -top-4 rounded-lg min-h-[55px] flex justify-center items-center bg-[var(--popover)] text-[var(--popover-foreground)] shadow-lg"
          >
            {header}
          </AnimatedDiv>
        </div>
      </div>
      <AnimatedDiv
        style={{
          ...contentAnimation,
          ...contentStyle,
        }}
        className="p-4"
      >
        {children}
      </AnimatedDiv>
      <AnimatedDiv
        style={{
          ...footerAnimation,
          ...footerStyle,
        }}
        className="p-4"
      >
        {footer}
      </AnimatedDiv>
    </AnimatedDiv>
  );
}

export default ProfileCard;
