import React, { ReactNode } from "react";

interface SocialAuroraBackgroundProps {
  children: ReactNode;
}

export const SocialAuroraBackground = ({
  children,
}: SocialAuroraBackgroundProps) => {
  return (
    <div className="relative overflow-hidden w-full h-full">
      {/* Main background with the dynamic aurora gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-900">
        {/* Aurora blur effect overlay */}
        <div className="absolute inset-0 opacity-50 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        {/* Animated glow spots */}
        <div className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>
      </div>

      {/* Container for content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default SocialAuroraBackground;
