import React from 'react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/e4ffc87afcbc0d5995c2455d596b582f5568f568?placeholderIfAbsent=true",
      title: "Atendimento",
      description: "Suporte rápido e especializado para cada cliente Chekauto"
    },
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/8cf0d474703da224a3a5d4612e34e3ea5fd2c52e?placeholderIfAbsent=true",
      title: "scanner chekauto",
      description: "Orientação rápida e completa para opções de implementos."
    },
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/8e957ecb8791005a9eaf57dffe8c1a47b2176e8b?placeholderIfAbsent=true",
      title: "",
      description: "Processos validados com confiança e sem riscos."
    }
  ];

  return (
    <section className="bg-white z-10 flex w-full flex-col items-center -mt-2.5 pl-20 pb-[170px] max-md:max-w-full max-md:pl-5 max-md:pb-[100px]">
      <div className="z-10 mt-[-50px] w-full max-w-[1274px] max-md:max-w-full">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          {features.map((feature, index) => (
            <article key={index} className="w-[33%] max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(240,186,29,1)] flex grow items-stretch gap-[18px] w-full px-[54px] py-[35px] rounded-[25px] max-md:mt-10 max-md:px-5 min-h-[140px]">
                <div className="bg-white flex flex-col items-center justify-center w-[49px] h-[49px] px-2.5 rounded-[50%]">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="aspect-[1.05] object-contain w-[22px]"
                  />
                </div>
                <div className="text-neutral-800">
                  {feature.title && (
                    <h3 className="text-base font-bold leading-[25px] uppercase">
                      {feature.title}
                      <br />
                    </h3>
                  )}
                  <p className={`text-sm font-normal leading-[15px] ${feature.title ? 'mt-[13px]' : 'mt-6'}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
