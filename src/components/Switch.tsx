import React from 'react';

interface SwitchProps {
  isOn: boolean;
  handleToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  width?: number;
  height?: number;
  label?: React.ReactNode;
}

const Switch: React.FC<SwitchProps> = ({ isOn, handleToggle, width = 48, height = 24, label }) => {
  const switchStyle = {
    width: `${width}px`,
    height: `${height}px`,
  };

  const sliderStyle = {
    borderRadius: `${height}px`,
  };

  const knobSize = height - 8;
  const knobStyle = {
    height: `${knobSize}px`,
    width: `${knobSize}px`,
    left: '4px',
    bottom: '4px',
  };

  const checkedKnobStyle = {
    transform: `translateX(${width - knobSize - 8}px)`,
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <label className="relative inline-block" style={switchStyle}>
        <input
          type="checkbox"
          checked={isOn}
          onChange={handleToggle}
          className="opacity-0 w-0 h-0 peer"
        />
        <span
          className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-background transition-all duration-400 peer-checked:bg-foreground peer-focus:shadow-[0_0_1px_#2196F3] before:content-[''] before:absolute before:bg-white before:transition-all before:duration-400 before:rounded-full peer-checked:before:translate-x-[26px]"
          style={sliderStyle}
        >
          <span
            className="absolute bg-primary rounded-full transition-all duration-400"
            style={{
              ...knobStyle,
              ...(isOn ? checkedKnobStyle : {}),
            }}
          />
        </span>
      </label>
      {label && <span className="mr-2 text-base italic">{label}</span>}
    </div>
  );
};

export default Switch;
