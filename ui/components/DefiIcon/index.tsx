import React, { FC } from "react";

interface DefiIconProps {
  height?: number;
  width?: number;
  icon: any | null;
}

const DefiIcon: FC<DefiIconProps> = ({ icon, height, width, ...rest }) => {
  let IconSVGRef = React.useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
  IconSVGRef.current = icon;
  if (IconSVGRef.current) {
    const { current: IconSVG } = IconSVGRef;
    return <IconSVG height={height} width={width} {...rest} />;
  }
  return null;
};

export default DefiIcon;
