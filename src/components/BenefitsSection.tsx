import React from 'react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      number: "1",
      title: "Equipe especializada e experiente"
    },
    {
      number: "2", 
      title: "Atendimento personalizado ao cliente"
    },
    {
      number: "3",
      title: "Conhecimento atualizado da legislação"
    },
    {
      number: "4",
      title: "Transparência em cada etapa do processo"
    }
  ];

  return (
    <section id="benefits" className="bg-white flex w-full flex-col items-center px-20 max-md:max-w-full max-md:px-5">
      <div className="w-full max-w-[1194px] mt-[293px] max-md:max-w-full max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          {benefits.map((benefit, index) => (
            <article key={index} className="w-3/12 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(240,186,29,1)] flex grow flex-col font-bold uppercase w-full pt-[49px] pb-[86px] px-[33px] rounded-lg max-md:mt-[17px] max-md:px-5">
                <div className="text-[rgba(221,173,33,1)] text-[64px] leading-none max-md:text-[40px]">
                  {benefit.number}
                </div>
                <h3 className="text-neutral-800 text-xl leading-[25px] mt-[189px] max-md:mt-10">
                  {benefit.title.split(' ').map((word, i, arr) => (
                    <React.Fragment key={i}>
                      {word}
                      {i < arr.length - 1 && (i + 1) % 2 === 0 ? <br /> : ' '}
                    </React.Fragment>
                  ))}
                </h3>
                <div className="bg-white flex w-[131px] shrink-0 h-[5px] mt-[7px]" />
              </div>
            </article>
          ))}
        </div>
      </div>
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/a3c216e4be3e0094a2d4121f1f0bb947a8a77d16?placeholderIfAbsent=true"
        alt="Decorative element"
        className="aspect-[1.01] object-contain w-[74px] mb-[-34px] mt-[171px] max-md:mt-10 max-md:mb-2.5 relative z-50"
      />
    </section>
  );
};
