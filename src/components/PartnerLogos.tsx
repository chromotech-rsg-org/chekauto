import React from 'react';

export const PartnerLogos: React.FC = () => {
  const logos = [
    "https://api.builder.io/api/v1/image/assets/TEMP/f1a201a7664a82516b4f2716a09a120a53e77160?placeholderIfAbsent=true",
    "https://api.builder.io/api/v1/image/assets/TEMP/8a421ff678bf227d9c96664b28f203268b28b58b?placeholderIfAbsent=true",
    "https://api.builder.io/api/v1/image/assets/TEMP/95de4c6328fc4bf4a71136855dee4d3ce8be1bf1?placeholderIfAbsent=true",
    "https://api.builder.io/api/v1/image/assets/TEMP/65d35cfb9b6c9b2d942fd4059d5febb34e8eaaf5?placeholderIfAbsent=true",
    "https://api.builder.io/api/v1/image/assets/TEMP/ea2a70dfbff547e0a940ae248b565600f2a62c0c?placeholderIfAbsent=true"
  ];

  return (
    <section className="bg-white flex w-full flex-col items-center px-20 max-md:max-w-full max-md:px-5">
      <div className="self-center flex w-full max-w-[1274px] items-stretch gap-5 flex-wrap justify-between mt-[201px] max-md:max-w-full max-md:mt-10">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Partner ${index + 1}`}
            className="aspect-[2.95] object-contain w-[174px] shrink-0 max-w-full grayscale hover:grayscale-0 transition-all duration-300"
          />
        ))}
      </div>
    </section>
  );
};
