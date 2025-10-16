import React from 'react';

export const CallToAction: React.FC = () => {
  return (
    <section className="bg-black flex w-full flex-col items-center justify-center px-20 py-[158px] max-md:max-w-full max-md:px-5 max-md:py-[100px]">
      <div className="mb-[-31px] w-[1152px] max-w-full max-md:mb-2.5">
        <div className="flex items-stretch gap-5 flex-wrap justify-between max-md:max-w-full">
          <div>
            <h2 className="text-[rgba(240,186,29,1)] text-4xl font-semibold leading-10 max-md:mr-2.5">
              Resolva seu RENAVE/BIN <br />
              de forma automática
            </h2>
            <p className="text-white text-xl font-normal leading-[25px] mt-8">
              Nós vamos assegurar que seu{" "}
              <span className="font-semibold">caminhão</span> esteja <br />
              totalmente{" "}
              <span className="underline">
                regular, validado e pronto para seguir
              </span>
              <br />
              <span className="underline">em frente.</span>
            </p>
          </div>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/d2903cb83386227b02e80b0cfa46e80c585da599?placeholderIfAbsent=true"
            alt="CHEKAUTO services"
            className="aspect-[5.68] object-contain w-[461px] mt-[86px] max-md:max-w-full max-md:mt-10"
          />
        </div>
        <button className="bg-[rgba(240,186,29,1)] flex w-[248px] max-w-full flex-col items-center text-base text-black font-semibold whitespace-nowrap text-center leading-loose justify-center mt-[55px] px-[70px] py-[21px] rounded-[39px] hover:bg-[rgba(220,166,9,1)] transition-colors max-md:mt-10 max-md:px-5">
          CONSULTAR
        </button>
      </div>
    </section>
  );
};
