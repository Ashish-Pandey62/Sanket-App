import { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";

const Card: React.FC<PropsWithChildren & ViewProps> = ({
  children,
  ...props
}) => {
  return (
    <View {...props} className={`p-1 rounded-xl bg-white/40 border-2 border-b-4 border-gray-600/10 ${props.className}`} >
      {children}
    </View>
  );
};

export default Card
