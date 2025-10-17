import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="bg-white flex w-full flex-col items-center px-20 max-md:max-w-full max-md:px-5">
      <div className="w-full max-w-[1486px] mt-24 max-md:max-w-full max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          <div className="w-[34%] max-md:w-full max-md:ml-0">
            <div className="flex flex-col items-stretch font-semibold max-md:max-w-full max-md:mt-10">
              <h2 className="text-[rgba(30,30,30,1)] text-[32px] leading-[30px] mr-[31px] max-md:max-w-full max-md:mr-2.5">
                <span className="font-semibold">CONFIABILIDADE, SEGURANÇA</span>
                <br />
                <span className="font-semibold">E AGILIDADE EM CADA</span>
                <span className="font-extrabold text-[rgba(250,169,84,1)]"> CHECK! </span>
              </h2>
              <p className="text-neutral-800 text-[15px] font-normal leading-[25px] mt-[57px] max-md:max-w-full max-md:mt-10">
                A <span className="font-bold">CHEKAUTO</span> nasceu para simplificar processos burocráticos no setor automotivo pesado.
                <br />
                <br />
                <span className="font-bold">Especialistas em RENAVE, BIN e assessoria documental</span>, nossa missão
                <br />
                é garantir que cada cliente tenha seus registros validados com segurança, agilidade e transparência. 
                <br />
                <br />
                Nosso diferencial está em unir técnica, tecnologia e atendimento próximo, fazemos isso porque acreditamos que cada detalhe importa.
              </p>
              <button className="bg-[rgba(240,186,29,1)] flex flex-col items-stretch text-base text-black text-center leading-loose justify-center mt-16 px-[61px] py-[21px] rounded-[39px] hover:bg-[rgba(220,166,9,1)] transition-colors max-md:mt-10 max-md:px-5">
                CONSULTAR CHASSI
              </button>
            </div>
          </div>
          <div className="w-[66%] ml-5 max-md:w-full max-md:ml-0">
            <div className="grow max-md:max-w-full max-md:mt-10">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                <div className="w-[33%] max-md:w-full max-md:ml-0">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/b578bf15ee98bcf629c7b4ccf6092fb7833daffa?placeholderIfAbsent=true"
                    alt="CHEKAUTO service"
                    className="aspect-[0.63] object-contain w-full grow rounded-lg max-md:mt-[7px]"
                  />
                </div>
                <div className="w-[67%] ml-5 max-md:w-full max-md:ml-0">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/c4316d0c217bab60bf0bfec84c4bec765521d71d?placeholderIfAbsent=true"
                    alt="CHEKAUTO team"
                    className="aspect-[1.3] object-contain w-full grow rounded-lg max-md:max-w-full max-md:mt-[7px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
